import { Component, OnInit } from '@angular/core';
import { InfiniteScrollCustomEvent } from '@ionic/angular';
import { NavController, ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { IP_ADDRESS } from '../../../constantes';
import { ApiServiceService } from '../../../api-service.service'
import { StatusBar, StatusBarStyle } from '@capacitor/status-bar';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-listar-sesiones-all',
  templateUrl: './listar-sesiones-all.page.html',
  styleUrls: ['./listar-sesiones-all.page.scss'],
})
export class ListarSesionesAllPage implements OnInit {

  public ip_address = IP_ADDRESS;
  public userSesion!:string;
  public userSesionPerfil!:any;

  public loading = true;

  dataSesiones!:any[];
  dataSesionesParcial!:any[];
  dataSesionesOrig!:any[];

  bookmarkSesionesState: { [key: number]: boolean } = {};
  dataBookMarkSesiones!:any[];

  dividendo:number=5;

  public searchTerm:string="";
  private previousSearchTerm: string = '';

  dataEntrenadorUsuarios!:any[];

  touchTimeout: any;

  showsearchbox:boolean=false;

  variableSesiones!:any;
  previusPageMain:boolean=false;
  previusPagelistarGuardados:boolean=false;
  previusPagelistarSesiones:boolean=false;
  previusPagecontratoEntrenador:boolean=false;

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
        this.obtenerbookmarksesiones();
        this.obtenerContratoEntrenadoresUsuario();
        //this.chanceColorFooter();
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
    StatusBar.setOverlaysWebView({ overlay: true });
    StatusBar.setBackgroundColor({color:'transparent'});
    StatusBar.setStyle({ style: StatusBarStyle.Dark });
  }

  cargarImagenesBefores(){
    const imageUrls = [];

    const sesiones = this.dataSesiones;
    if (Array.isArray(sesiones)) {
      for (let i = 0; i < sesiones.length; i++) {
        const nameImagen = sesiones[i].IMAGESESION;
        const imageUrl = this.ip_address+'/media/sesiones/portadassesiones/'+nameImagen;
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
    if(this.dataSesionesParcial<this.dataSesiones){
      this.llenarMasDatos();
      setTimeout(() => {
        (ev as InfiniteScrollCustomEvent).target.complete();
      }, 1000);
    }else{
      this.presentCustomToast('Cargado todos los Ejercicios','success');
    }

  }


  toggleBookmarkOSesiones(index: number): void {
    this.loading=true;
    if (this.bookmarkSesionesState[index]) {
      this.bookmarkSesionesState[index] = false;
      this.updateLikeTEjercicio(index,this.bookmarkSesionesState[index],'bookmarksesiones');
    } else {
      this.bookmarkSesionesState[index] = true;
      this.updateLikeTEjercicio(index,this.bookmarkSesionesState[index],'bookmarksesiones');
    }
    this.dataSesiones = this.dataSesiones.filter((element) => this.bookmarkSesionesState[element.IDSESION]);
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
    }else{
      const name='main';
      this.navController.navigateForward('/'+name);
    }
  }
  go_page(name: string){
    this.navController.navigateForward('/'+name);
  }
  go_programSesiones(item:any,name:string) {
    this.go_page_create(name,item);
  }
  go_page_create(name: string, data: any) {
      this.navController.navigateForward('/' + name, {
        queryParams: {
          previusPagelistarSesionesRutinasAll:true,
          variableprogramarrutinas: data,
        }
      });
  }
  public onInputChange(event: any) {
    const currentSearchTerm = event.target.value;
    if (this.previousSearchTerm && currentSearchTerm.length < this.previousSearchTerm.length) {
      this.dataSesionesParcial=this.dataSesionesOrig;
    }
    this.previousSearchTerm = currentSearchTerm;
    this.filterItems();
  }

  private filterItems() {
    this.dataSesionesParcial = this.dataSesionesOrig;

    const searchTerms = this.searchTerm.toLowerCase().trim().split(' ');
    if (searchTerms.length >= 1) {
      let filteredArray: any[] = [];
      for (const term of searchTerms) {
        const filteredItems = this.dataSesiones.filter(item =>
          (item.DESCRIPCIONOBJETIVOSPERSONALES && item.DESCRIPCIONOBJETIVOSPERSONALES.toLowerCase().includes(term)) ||
          (item.DESCRIPCIONPROFESION && item.DESCRIPCIONPROFESION.toLowerCase().includes(term)) ||
          (item.NICKNAMEPERSONA && item.NICKNAMEPERSONA.toLowerCase().includes(term)) ||
          (item.NOMBRESESION && item.NOMBRESESION.toLowerCase().includes(term)) ||
          (item.OBJETIVOSESION && item.OBJETIVOSESION.toLowerCase().includes(term)) ||
          (item.PREMIER && item.PREMIER.toLowerCase().includes(term)) ||
          (item.TituloFrecuenciaEjercicio && item.TituloFrecuenciaEjercicio.toLowerCase().includes(term)) ||
          (item.OBSERVACIONSESION && item.OBSERVACIONSESION.toLowerCase().includes(term))
        );
        filteredArray = filteredArray.concat(filteredItems);
      }
      // Eliminar duplicados del array filtrado
      this.dataSesionesParcial = Array.from(new Set(filteredArray));
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
    let backgroundImage = `linear-gradient(183deg, ${gradientColor1}, ${gradientColor2}), url('${this.ip_address}/media/sesiones/portadassesiones/${imageUrl}')`;

    return {
      'background-image': backgroundImage,
      'background-repeat': 'no-repeat',
      'background-size': 'cover'
    };
  }

  llenarMasDatos(){
    const endIndex = Math.ceil(this.dataSesionesParcial.length / this.dividendo);
    const start = endIndex * this.dividendo;
    const end = endIndex * this.dividendo + this.dividendo;
    const additionalData = this.dataSesiones.slice(start, end > this.dataSesiones.length ? this.dataSesiones.length : end);
    this.dataSesionesParcial.push(...additionalData);
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
        this.obtenerSesiones();
      },
      (error) => {
        this.presentCustomToast(error.error.error,"danger");
      }
    );
  }

  obtenerSesiones(){
    this.apiService.getSesionesActivate().subscribe(
      (response) => {
        this.dataSesiones=response;
        this.dataSesiones = this.dataSesiones.map(objeto => ({
          ...objeto,
          IDRUTINAS: objeto.IDRUTINAS.split(",").map(Number)
        }));

        try {
          if (this.dataEntrenadorUsuarios && this.dataEntrenadorUsuarios.length > 0) {
            this.dataSesiones = this.dataSesiones.filter(elemento =>{
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
        this.dataSesiones.sort((a, b) => {
          const premierOrder: { [key: string]: number } = {
            Gratis: 0,
            Suscripto: 1,
            Premium: 2,
          };
          const premierA = premierOrder[a.PREMIER];
          const premierB = premierOrder[b.PREMIER];
          return premierA - premierB;
        });
        this.dataSesionesParcial=this.dataSesiones.slice(0, this.dividendo);
        const rawData = this.dataSesiones;
        this.dataSesionesOrig = rawData.map(item => ({ ...item }));
        this.cargarImagenesBefores();
      },
      (error) => {
        this.presentCustomToast(error.error.error,"danger");
      }
    );
  }


  obtenerbookmarksesiones(){
    this.apiService.allBookmark('bookmarksesiones').subscribe(
      (response) => {
        this.dataBookMarkSesiones=response;
        this.dataBookMarkSesiones= this.dataBookMarkSesiones.filter(element=>element.IDPERSONA ===this.userSesionPerfil[0].IDPERSONA)
        this.dataBookMarkSesiones.forEach(liketejercicio => {
          this.bookmarkSesionesState[liketejercicio.IDSESION] = true;
        });
        this.obtenerSesiones();
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
