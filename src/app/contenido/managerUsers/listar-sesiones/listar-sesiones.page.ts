import { Component, OnInit } from '@angular/core';
import { StatusBar } from '@capacitor/status-bar';
import { Storage } from '@ionic/storage-angular';
import { IP_ADDRESS } from '../../../constantes';
import { ApiServiceService } from '../../../api-service.service';
import { NavController, ToastController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-listar-sesiones',
  templateUrl: './listar-sesiones.page.html',
  styleUrls: ['./listar-sesiones.page.scss'],
})
export class ListarSesionesPage implements OnInit {
  public ip_address = IP_ADDRESS;

  public userSesion!:string;
  public userSesionPerfil!:any;
  public loading = true;

  variable!:any;
  previusPageMain:boolean=false;
  previusPagelistarGuardados:boolean=false;

  public dataRutinas!: any[];

  public dataSesiones!:any[];

  showImage=false;

  LikeOPersonalState: { [key: number]: boolean } = {};
  dataLikeOPersonal!:any[];

  bookmarkRutinasState: { [key: number]: boolean } = {};
  dataBookMarkRutinas!:any[];

  bookmarkSesionesState: { [key: number]: boolean } = {};
  dataBookMarkSesiones!:any[];

  dataEntrenadorUsuarios!:any[];

  totalRutinas!:any[];
  totalSesiones!:any[];

  constructor(private navController: NavController,
    private route: ActivatedRoute,
    private apiService: ApiServiceService,
    private storage: Storage,
    public toastController: ToastController) { }


  ngOnInit() {
    this.recuperarDatos();
     this.validateSesion();
   //this.test();

  }
  ionViewDidEnter() {
    this.recuperarDatos();
    this.validateSesion();
    //this.test();
  }
  test(){
    this.chanceColorFooter();
    this.StatusBar();
    this.obtenerbookmarksesiones();
    this.obtenerbookmarkrutinas();
    this.obtenerLikeOPersonal();
    this.obtenerContratoEntrenadoresUsuario();
    //this.obtenerRutinas();
    //this.obtenerSesiones();
    this.loading=false;
  }
  recuperarDatos(){
    this.route.queryParams.subscribe(params => {
      this.variable = params['variableSesiones'] as any;
      this.previusPageMain = params['previusPageMain'] as boolean|| false;
      this.previusPagelistarGuardados = params['previusPagelistarGuardados'] as boolean|| false;
    });
  }
  StatusBar(){
    StatusBar.hide();
    StatusBar.setOverlaysWebView({ overlay: true });
    StatusBar.setBackgroundColor({ color: '#ffffff' });
  }
  async validateSesion() {
    try {
      this.storage.get('sesion').then(async (sesion) => { // Marcar como async aquí
        if (sesion && JSON.parse(sesion).rolUsuario == 1) {
          this.userSesion = JSON.parse(sesion).nickname;
          this.obtenerGetPerfilCompleto(this.userSesion);
          await this.apiService.protectedRequestWithToken(JSON.parse(sesion).token).toPromise(); // Utilizar toPromise() para poder usar await
          this.chanceColorFooter();
          this.StatusBar();
          this.totalRutinas = await this.obtenercontarTypes('rutina');
          this.totalSesiones = await this.obtenercontarTypes('programarsesion');
          this.obtenerbookmarksesiones();
          this.obtenerbookmarkrutinas();
          this.obtenerLikeOPersonal();
          this.obtenerContratoEntrenadoresUsuario();
          //this.obtenerRutinas();
          //this.obtenerSesiones();
        } else {
          this.handleError();
        }
      });
    } catch (error) {
      this.handleError();
    }
  }

  private handleError() {
    this.loading = false;
    this.navController.navigateForward('/error-page-users-trainers');
    this.storage.remove('sesion');
  }
  private chanceColorFooter(){
    document.documentElement.style.setProperty('--activate-foot10',' transparent');
    document.documentElement.style.setProperty('--activate-foot11',' #6b6a6b');
    document.documentElement.style.setProperty('--activate-foot20',' #9259f9');
    document.documentElement.style.setProperty('--activate-foot21',' #9259f9');
    document.documentElement.style.setProperty('--activate-foot30',' transparent');
    document.documentElement.style.setProperty('--activate-foot31',' #6b6a6b');
    document.documentElement.style.setProperty('--activate-foot40',' transparent');
    document.documentElement.style.setProperty('--activate-foot41',' #6b6a6b');
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
    const sesiones = this.dataSesiones;
    if (Array.isArray(sesiones)) {
      for (let i = 0; i < sesiones.length; i++) {
        const nameImagen = sesiones[i].IMAGESESION;
        const imageUrl = this.ip_address+'/media/sesiones/portadassesiones/'+nameImagen;
        imageUrls.push(imageUrl);
      }
    }

    const imageUrl = this.ip_address+'/media/objetivospersonales/'+this.variable.IMAGEOBJETIVOSPERSONALES;
    imageUrls.push(imageUrl);
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

  toggleBookmarkOPersonal(index: number): void {
    this.loading=true;
    if (this.LikeOPersonalState[index]) {
      this.LikeOPersonalState[index] = false;
      this.updateLikeTEjercicio(index,this.LikeOPersonalState[index],'likeobjetivopersonal');
    } else {
      this.LikeOPersonalState[index] = true;
      this.updateLikeTEjercicio(index,this.LikeOPersonalState[index],'likeobjetivopersonal');
    }
    setTimeout(() => {
      this.loading=false;
    }, 500);
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
  toggleBookmarkOSesiones(index: number): void {
    this.loading=true;
    if (this.bookmarkSesionesState[index]) {
      this.bookmarkSesionesState[index] = false;
      this.updateLikeTEjercicio(index,this.bookmarkSesionesState[index],'bookmarksesiones');
    } else {
      this.bookmarkSesionesState[index] = true;
      this.updateLikeTEjercicio(index,this.bookmarkSesionesState[index],'bookmarksesiones');
    }
    setTimeout(() => {
      this.loading=false;
    }, 500);
  }
  MessagePremium(){
    this.presentCustomToast('Ejercicio Premium, Suscribase para acceder a ellos','warning');
  }
  go_page(name: string){
    this.dataLikeOPersonal=[];
    this.navController.navigateForward('/' + name, {
      queryParams: {
        variableSesiones: this.variable,
        previusPageMain : this.previusPageMain,
        previusPagelistarGuardados : this.previusPagelistarGuardados,
        previusPagelistarSesiones:true,
      }
    });
  }

  go_page_with_dates(namePage:string){
    if(namePage==="listar-rutinas-diarias"){
      this.navController.navigateForward('/' + namePage, {
        queryParams: {
          variablelistarrutinasdiarias:this.dataRutinas,
          variableSesiones:this.variable,
          previusPageMain : this.previusPageMain,
          previusPagelistarGuardados : this.previusPagelistarGuardados,
        }
      });
    }else{
      this.navController.navigateForward('/' + namePage, {
        queryParams: {
          variablelistarprogramasrutinas:this.dataSesiones,
          variableSesiones:this.variable,
          previusPageMain : this.previusPageMain,
          previusPagelistarGuardados : this.previusPagelistarGuardados,
        }
      });
    }
  }
  go_page_create(name: string, data: any) {
    this.showImage=false;
    if(name==="rutinas-diarias"){
      this.navController.navigateForward('/' + name, {
        queryParams: {
          variableRutinaDiaria: data,
          variableSesiones:this.variable,
          previusPageMain : this.previusPageMain,
          previusPagelistarGuardados : this.previusPagelistarGuardados,
        }
      });
    }else{
      this.navController.navigateForward('/' + name, {
        queryParams: {
          variableprogramarrutinas: data,
          variableSesiones:this.variable,
          previusPageMain : this.previusPageMain,
          previusPagelistarGuardados : this.previusPagelistarGuardados,
        }
      });
    }
  }
  expandBox(event: any,item:any,name:string) {
    this.go_page_create(name,item);
  }
  getBackgroundStyle(imageUrl: string, showImage: boolean) {
    let gradientColor2 = showImage ? '#f1f3f8' : '#0000009f'; // Color del primer punto del gradiente
    let gradientColor1 = showImage ? '#00000009' : '#ffffff21'; // Color del segundo punto del gradiente
    let backgroundImage = `linear-gradient(0deg, ${gradientColor2}, ${gradientColor1}), url('${this.ip_address}/media/rutinas/portadasrutinas/${imageUrl}')`;

    return {
      'background-image': backgroundImage,
      'background-repeat': 'no-repeat',
      'background-size': 'cover'
    };
  }
  getBackgroundStyle2(imageUrl: string, showImage: boolean) {
    let gradientColor2 = showImage ? '#f1f3f8' : '#0000009f'; // Color del primer punto del gradiente
    let gradientColor1 = showImage ? '#00000009' : '#ffffff21'; // Color del segundo punto del gradiente
    let backgroundImage = `linear-gradient(0deg, ${gradientColor2}, ${gradientColor1}), url('${this.ip_address}/media/sesiones/portadassesiones/${imageUrl}')`;

    return {
      'background-image': backgroundImage,
      'background-repeat': 'no-repeat',
      'background-size': 'cover'
    };
  }

  getBackgroundStyleAll(imageUrl: string) {
    let gradientColor1 = '#00000060' ; // Color del primer punto del gradiente
    let gradientColor2 = '#a576f69d'; // Color del segundo punto del gradiente
    let backgroundImage = `linear-gradient(0deg, ${gradientColor1}, ${gradientColor2}), url('${this.ip_address}/media/${imageUrl}')`;

    return {
      'background-image': backgroundImage,
      'background-repeat': 'no-repeat',
      'background-size': 'cover'
    };
  }


  formatDuracionRutina(duracion: string): string {
    const partes = duracion.split(':');
    if (partes.length === 3 && partes[0] === '00') {
      // Solo muestra minutos y segundos
      return `${parseInt(partes[1], 10)}:${partes[2]}`;
    }
    // Mantén el formato original
    return duracion;
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
        this.dataRutinas = this.dataRutinas.filter(element => element.IDOBJETIVOSPERSONALESRUTINA === this.variable.IDOBJETIVOSPERSONALES);
        this.dataRutinas = this.dataRutinas.map(objeto => ({
          ...objeto,
          IDEJERCICIOS: objeto.IDEJERCICIOS.split(",").map(Number)
        }));
        if (this.dataEntrenadorUsuarios && this.dataEntrenadorUsuarios.length > 0 && this.dataRutinas && this.dataRutinas.length>0) {
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
        } else {
          this.presentCustomToast('Error en Mostrar Rutinas','danger');
          //this.obtenerRutinas();
          //console.log('this.dataEntrenadorUsuarios no está definido o no contiene elementos.');
        }
        if (this.dataEntrenadorUsuarios && this.dataEntrenadorUsuarios.length > 0 && this.dataRutinas && this.dataRutinas.length>0) {
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
        }
        //console.log(this.dataRutinas);
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
        this.dataSesiones = this.dataSesiones.filter(element => element.IDOBJETIVOSPERSONALESSESION === this.variable.IDOBJETIVOSPERSONALES);
        this.dataSesiones = this.dataSesiones.map(objeto => ({
          ...objeto,
          IDRUTINAS: objeto.IDRUTINAS.split(",").map(Number)
        }));

        if (this.dataEntrenadorUsuarios && this.dataEntrenadorUsuarios.length > 0 && this.dataSesiones && this.dataSesiones.length>0) {
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
        } else {
          this.presentCustomToast('Error en Mostrar Rutinas','danger');
          //console.log('this.dataEntrenadorUsuarios no está definido o no contiene elementos.');
        }
        if (this.dataEntrenadorUsuarios && this.dataEntrenadorUsuarios.length > 0 && this.dataSesiones && this.dataSesiones.length>0) {
        this.dataSesiones.sort((a, b) => {
          const premierOrder: { [key: string]: number } = {
            Suscripto: 0,
            Gratis: 1,
            Premium: 2,
          };
          const premierA = premierOrder[a.PREMIER];
          const premierB = premierOrder[b.PREMIER];
          return premierA - premierB;
        });
        }
        //console.log(this.dataSesiones);
        if(this.dataRutinas && this.dataSesiones && (this.dataRutinas.length>0 || this.dataSesiones.length>0)){
          this.cargarImagenesBefores();
        }else{
          this.loading=false;
        }
      },
      (error) => {
        this.presentCustomToast(error.error.error,"danger");
      }
    );
  }
  obtenerLikeOPersonal(){
    this.apiService.allBookmark('likeobjetivopersonal').subscribe(
      (response) => {
        this.dataLikeOPersonal=response;
        this.dataLikeOPersonal= this.dataLikeOPersonal.filter(element=>element.IDPERSONA ===this.userSesionPerfil[0].IDPERSONA)
        this.dataLikeOPersonal.forEach(liketejercicio => {
          this.LikeOPersonalState[liketejercicio.IDOBJETIVOSPERSONALES] = true;
        });
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
  obtenerbookmarksesiones(){
    this.apiService.allBookmark('bookmarksesiones').subscribe(
      (response) => {
        this.dataBookMarkSesiones=response;
        this.dataBookMarkSesiones= this.dataBookMarkSesiones.filter(element=>element.IDPERSONA ===this.userSesionPerfil[0].IDPERSONA)
        this.dataBookMarkSesiones.forEach(liketejercicio => {
          this.bookmarkSesionesState[liketejercicio.IDSESION] = true;
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

  async obtenercontarTypes(nameTable:string): Promise<any[]>{
    try {
      const response = await this.apiService.obtenercontarTypes(nameTable).toPromise();
      return response;
    } catch (error) {
      this.presentCustomToast("Sin Registro", "danger");
      throw error;
    }
  }
}
