import { Component, OnInit } from '@angular/core';
import { InfiniteScrollCustomEvent } from '@ionic/angular';
import { NavController, ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { IP_ADDRESS } from '../../../constantes';
import { ApiServiceService } from '../../../api-service.service'
import { StatusBar } from '@capacitor/status-bar';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-listar-rutinas-all',
  templateUrl: './listar-rutinas-all.page.html',
  styleUrls: ['./listar-rutinas-all.page.scss'],
})
export class ListarRutinasAllPage implements OnInit {
  public ip_address = IP_ADDRESS;
  public userSesion!:string;
  public userSesionPerfil!:any;

  public loading = true;

  dataRutinas!:any[];
  dataRutinasParcial!:any[];
  dataRutinasOrig!:any[];

  bookmarkRutinasState: { [key: number]: boolean } = {};
  dataBookMarkRutinas!:any[];

  dividendo:number=5;

  public searchTerm:string="";
  private previousSearchTerm: string = '';

  dataEntrenadorUsuarios!:any[];


  variableSesiones!:any;
  previusPageMain:boolean=false;
  previusPagelistarGuardados:boolean=false;
  previusPagelistarSesiones:boolean=false;
  previusPagecontratoEntrenador:boolean=false;
  showsearchbox:boolean=false;
  constructor(
    private route: ActivatedRoute,
    private navController: NavController,
    private apiService: ApiServiceService,
    private storage: Storage,
    public toastController: ToastController
  ) { }


  ngOnInit() {
     this.recuperarDatos();
    this.validateSesion();
  }
  ionViewDidEnter() {
    this.recuperarDatos();
    this.validateSesion();
  }
  recuperarDatos(){
    this.route.queryParams.subscribe(params => {
      this.variableSesiones = params['variableSesiones'] as any;
      this.previusPageMain = params['previusPageMain'] as boolean|| false;
      this.previusPagelistarGuardados = params['previusPagelistarGuardados'] as boolean|| false;
      this.previusPagelistarSesiones  = params['previusPagelistarSesiones'] as boolean|| false;
      this.previusPagecontratoEntrenador  = params['previusPagecontratoEntrenador'] as boolean|| false;
    });
  }

  async validateSesion() {
    try {
      const sesion = await this.storage.get('sesion');
      if (sesion && JSON.parse(sesion).rolUsuario == 1) {
        this.userSesion = JSON.parse(sesion).nickname;
        this.obtenerGetPerfilCompleto(this.userSesion);
        const response =
        await this.apiService.protectedRequestWithToken(JSON.parse(sesion).token).toPromise();
        this.obtenerbookmarkrutinas();
        this.obtenerContratoEntrenadoresUsuario();
        this.chanceColorFooter();
        this.StatusBar();
        this.loading = false;
      } else {
        this.handleError();
      }
    } catch (error) {
      this.handleError();
    }
  }

  private handleError() {
    this.loading = false;
    this.navController.navigateForward('/error-users');
    this.storage.remove('sesion');
  }
  private chanceColorFooter(){
    document.documentElement.style.setProperty('--activate-foot10',' #ffffff');
    document.documentElement.style.setProperty('--activate-foot11',' #ffffff');
    document.documentElement.style.setProperty('--activate-foot20',' transparent');
    document.documentElement.style.setProperty('--activate-foot21',' #ffffff');
    document.documentElement.style.setProperty('--activate-foot30',' transparent');
    document.documentElement.style.setProperty('--activate-foot31',' #ffffff');
    document.documentElement.style.setProperty('--activate-foot40',' transparent');
    document.documentElement.style.setProperty('--activate-foot41',' #ffffff');
  }

  StatusBar(){
    StatusBar.hide();
    StatusBar.setOverlaysWebView({ overlay: true });
    StatusBar.setBackgroundColor({ color: '#ffffff' });
  }

  cargarImagenesBefores(){
    const rutinas = this.dataRutinas;
    const imageUrls = [];
    if (Array.isArray(rutinas)) {
      for (let i = 0; i < rutinas.length; i++) {
        const nameImagen = rutinas[i].IMAGENRUTINA;
        const imageUrl = this.ip_address+'/media/rutinas/portadasrutinas/'+nameImagen;
        imageUrls.push(imageUrl);
      }
    }

    let imagesLoaded = 0;
    const totalImages = imageUrls.length;
    const handleImageLoad = () => {
      imagesLoaded++;
      if (imagesLoaded === totalImages) {
          this.loading = false;
      }
    };
    imageUrls.forEach((imageUrl) => {
      const image = new Image();
      image.onload = handleImageLoad;
      image.src = imageUrl;
    });
  }



  onIonInfinite(ev:any) {
    if(this.dataRutinasParcial<this.dataRutinas){
      this.llenarMasDatos();
      setTimeout(() => {
        (ev as InfiniteScrollCustomEvent).target.complete();
      }, 1000);
    }else{
      this.presentCustomToast('Cargado todos los Ejercicios','success');
    }

  }


  toggleBookmarkRutinas(index: number): void {
    this.loading=true;
    if (this.bookmarkRutinasState[index]) {
      this.bookmarkRutinasState[index] = false;
      this.updateLikeTEjercicio(index,this.bookmarkRutinasState[index],'bookmarkrutinas');
    } else {
      this.bookmarkRutinasState[index] = true;
      this.updateLikeTEjercicio(index,this.bookmarkRutinasState[index],'bookmarkrutinas');
    }
    setTimeout(() => {
      this.loading=false;
    }, 500);
  }
  MessagePremium(){
    this.presentCustomToast('Ejercicio Premium, Suscribase para acceder a ellos','warning');
  }
  go_pageback(){
    if(this.previusPagelistarSesiones){
      const name='listar-sesiones';
      this.navController.navigateForward('/' + name, {
        queryParams: {
          variableSesiones: this.variableSesiones,
          previusPageMain : this.previusPageMain,
          previusPagelistarGuardados : this.previusPagelistarGuardados,
          previusPagelistarSesiones:'',
        }
      });
    }else if(this.previusPagecontratoEntrenador){
      const name='contrato-entrenador';
      this.navController.navigateForward('/'+name);
    }
    else{
      const name='main';
      this.navController.navigateForward('/'+name);
    }
  }
  go_page(name:string){
    this.navController.navigateForward('/'+name);
  }
  go_programRutinas(item:any,name:string) {
    this.go_page_create(name,item);
  }
  go_page_create(name: string, data: any) {
      this.navController.navigateForward('/' + name, {
        queryParams: {
          previusPagelistarRutinasAll:true,
          variableRutinaDiaria: data,
        }
      });
  }
  public onInputChange(event: any) {
    const currentSearchTerm = event.target.value;
    if (this.previousSearchTerm && currentSearchTerm.length < this.previousSearchTerm.length) {
      this.dataRutinasParcial=this.dataRutinasOrig;
    }
    this.previousSearchTerm = currentSearchTerm;
    this.filterItems();
  }

  private filterItems() {
    this.dataRutinasParcial = this.dataRutinasOrig;

    const searchTerms = this.searchTerm.toLowerCase().trim().split(' ');
    if (searchTerms.length >= 1) {
      let filteredArray: any[] = [];
      for (const term of searchTerms) {
        const filteredItems = this.dataRutinas.filter(item =>
          (item.DESCRIPCIONOBJETIVOSPERSONALES && item.DESCRIPCIONOBJETIVOSPERSONALES.toLowerCase().includes(term)) ||
          (item.DESCRIPCIONRUTINA && item.DESCRIPCIONRUTINA.toLowerCase().includes(term)) ||
          (item.NICKNAMEPERSONA && item.NICKNAMEPERSONA.toLowerCase().includes(term)) ||
          (item.NOMBRERUTINA && item.NOMBRERUTINA.toLowerCase().includes(term)) ||
          (item.OBSERVACIONRUTINA && item.OBSERVACIONRUTINA.toLowerCase().includes(term)) ||
          (item.PREMIER && item.PREMIER.toLowerCase().includes(term)) ||
          (item.NOMBRETIPOEJERCICIO && item.NOMBRETIPOEJERCICIO.toLowerCase().includes(term))
        );
        filteredArray = filteredArray.concat(filteredItems);
      }
      // Eliminar duplicados del array filtrado
      this.dataRutinasParcial = Array.from(new Set(filteredArray));
    }
  }


  obtenerDuracionEnMinutos(tiempo:string):number {
    const tiempoPartes = tiempo.split(":");
    const horas = parseInt(tiempoPartes[0]);
    const minutos = parseInt(tiempoPartes[1]);
    const segundos = parseInt(tiempoPartes[2]);

    const duracionMinutos = horas * 60 + minutos + segundos / 60;

    return parseFloat(duracionMinutos.toFixed(4));
  }
  formatDuracionRutina(duracion: string): string {
    if (duracion && duracion.includes(':')) {
      const partes = duracion.split(':');
      if (partes.length === 3 && partes[0] === '00') {
        // Solo muestra minutos y segundos
        return `${parseInt(partes[1], 10)}:${partes[2]}`;
      }
    }
    // Mantén el formato original o devuelve un valor predeterminado si es necesario
    return duracion || 'N/A';
  }

  getBackgroundStyle(imageUrl: string,) {

    let gradientColor2 = '#5f48898a' ; // Color del primer punto del gradiente
    let gradientColor1 = '#000000b3' ; // Color del segundo punto del gradiente
    let backgroundImage = `linear-gradient(183deg, ${gradientColor1}, ${gradientColor2}), url('${this.ip_address}/media/rutinas/portadasrutinas/${imageUrl}')`;

    return {
      'background-image': backgroundImage,
      'background-repeat': 'no-repeat',
      'background-size': 'cover'
    };
  }

  llenarMasDatos(){
    const endIndex = Math.ceil(this.dataRutinasParcial.length / this.dividendo);
    const start = endIndex * this.dividendo;
    const end = endIndex * this.dividendo + this.dividendo;
    const additionalData = this.dataRutinas.slice(start, end > this.dataRutinas.length ? this.dataRutinas.length : end);
    this.dataRutinasParcial.push(...additionalData);
  }

  async presentCustomToast(message: string, color: string) {
  const toast = await this.toastController.create({
    message: message,
    duration: 1000,
    position: 'top',
    cssClass: `toast-custom-${color}`,
    buttons: [
      {
        side: 'end',
        icon: 'close',
        role: 'cancel'
      }
    ]
  });
    const alertElement = document.querySelector(`.toast-custom-${color}`) as HTMLDivElement;
    alertElement.style.setProperty('--alert-top', `calc(50% + (9% * 0) + 8%)`);
    toast.present();
  }


  obtenerGetPerfilCompleto(nickname:string){
    this.apiService.connsultPerfilUsuarioCompleto(nickname).subscribe(
      (response) => {
        this.userSesionPerfil=response;
      },
      (error) => {
        this.presentCustomToast(error.error.error,"danger");
      }
    );
  }

  obtenerContratoEntrenadoresUsuario(){
    this.apiService.obtenerContratoEntrenadoresUsuario(this.userSesionPerfil && this.userSesionPerfil[0].IDUSUARIO).subscribe(
      (response) => {
        this.dataEntrenadorUsuarios=response;
        this.obtenerRutinas();
      },
      (error) => {
        this.presentCustomToast(error.error.error,"danger");
      }
    );
  }
  obtenerRutinas(){
    this.apiService.getRutinasActivate().subscribe(
      (response) => {
        this.dataRutinas=response;
        this.dataRutinas = this.dataRutinas.map(objeto => ({
          ...objeto,
          IDEJERCICIOS: objeto.IDEJERCICIOS.split(",").map(Number)
        }));
        try {
          if (this.dataEntrenadorUsuarios && this.dataEntrenadorUsuarios.length > 0) {
            this.dataRutinas = this.dataRutinas.filter(elemento =>{
              if(this.dataEntrenadorUsuarios.some(item => item.IDPERSONA === elemento.IDENTRENADOR )){
                elemento.PREMIER = 'Suscripto';
                return true;
              }else if(elemento.IDROLUSUARIO===99){
                elemento.PREMIER = 'Gratis';
                return true;
              }else{
                elemento.PREMIER = 'Premium';
                return true;
              }
            }
            );
          }
        } catch (error) {
          this.presentCustomToast('Error en Mostrar Rutinas','danger');
        }
        this.dataRutinas.sort((a, b) => {
          const premierOrder: { [key: string]: number } = {
            Suscripto: 0,
            Gratis: 1,
            Premium: 2,
          };
          const premierA = premierOrder[a.PREMIER];
          const premierB = premierOrder[b.PREMIER];
          return premierA - premierB;
        });
        //console.log(this.dataRutinas);
        this.dataRutinasParcial=this.dataRutinas.slice(0, this.dividendo);
        const rawData = this.dataRutinas;
        this.dataRutinasOrig = rawData.map(item => ({ ...item }));
        this.cargarImagenesBefores();
      },
      (error) => {
        this.presentCustomToast(error.error.error,"danger");
      }
    );
  }


  obtenerbookmarkrutinas(){
    this.apiService.allBookmark('bookmarkrutinas').subscribe(
      (response) => {
        this.dataBookMarkRutinas=response;
        this.dataBookMarkRutinas= this.dataBookMarkRutinas.filter(element=>element.IDPERSONA ===this.userSesionPerfil[0].IDPERSONA)
        this.dataBookMarkRutinas.forEach(liketejercicio => {
          this.bookmarkRutinasState[liketejercicio.IDRUTINA] = true;
        });
      },
      (error) => {
        this.presentCustomToast(error.error.error,"danger");
      }
    );
  }

  updateLikeTEjercicio(idEjercicio:number,status:boolean,type:string){
    this.apiService.updateBookmarkpersona( idEjercicio,this.userSesionPerfil[0].IDPERSONA,status,type).subscribe(
      (response) => {
        this.presentCustomToast(response.message,"success");
      },
      (error) => {
        this.presentCustomToast(error.error.error,"danger");
      }
    );
  }

}
