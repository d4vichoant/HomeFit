import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StatusBar, StatusBarStyle } from '@capacitor/status-bar';
import { NavController, ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { IP_ADDRESS } from '../../../constantes';
import { ApiServiceService } from '../../../api-service.service';

@Component({
  selector: 'app-listar-parametros',
  templateUrl: './listar-parametros.page.html',
  styleUrls: ['./listar-parametros.page.scss'],
})
export class ListarParametrosPage implements OnInit {
  public userSesion!:string;
  public userSesionPerfil!:any;
  public loading = true;

  public ip_address = IP_ADDRESS;

  bookmarkState: { [key: number]: boolean } = {};
  dataBookMark!:any[];
  variable!:any;
  dataEntrenadorUsuarios!:any[];
  previusPageMain:boolean=false;
  previusPagelistarGuardados:boolean=false;
  public dataEjercicio!: any[];
  public dataEjercicioOrig!: any[];
  valueNivel:number=-1;

  LikeOMuscularState: { [key: number]: boolean } = {};
  dataLikeOMuscular!:any[];

  LikeTEjercicioState: { [key: number]: boolean } = {};
  dataLikeTEjercicio!:any[];

  totalEjercicio!:any[];

  constructor(private navController: NavController,
  private route: ActivatedRoute,
  private apiService: ApiServiceService,
  private storage: Storage,
  public toastController: ToastController
  ) {
  }

  ngOnInit() {
     this.recuperarDatos();
    this.validateSesion();
    this.valueNivel=-1;
    //this.test();

  }
  ionViewDidEnter() {
    this.recuperarDatos();
    this.validateSesion();
    this.valueNivel=-1;
    //this.test();
  }
  test(){
    //this.chanceColorFooter();
    this.StatusBar();
    this.obtenerLikeTEjercicio();
    this.obtenerLikeOMuscular();
    this.obtenerBookMarkUser();
    this.obtenerEjercicios();
    this.loading=false;
  }
  recuperarDatos(){
    this.route.queryParams.subscribe(params => {
      this.variable = params['variableParametro'] as any;
      this.previusPageMain = params['previusPageMain'] as boolean|| false;
      this.previusPagelistarGuardados = params['previusPagelistarGuardados'] as boolean|| false;
    });
  }
  goEjercicioUniq(item:any,name:string){
    this.dataBookMark=[];
    this.navController.navigateForward('/' + name, {
      queryParams: {
        variableParametro: this.variable,
        previusPageMain:this.previusPageMain,
        previusPagelistarGuardados:this.previusPagelistarGuardados,
        variableEjercicio:item,
      }
    });
  }
  StatusBar(){
    StatusBar.setOverlaysWebView({ overlay: true });
    StatusBar.setBackgroundColor({color:'transparent'});
    StatusBar.setStyle({ style: StatusBarStyle.Light });
  }
  async validateSesion() {
    try {
      const sesion = await this.storage.get('sesion'); // Esperar la respuesta de storage.get() utilizando await
      if (sesion && JSON.parse(sesion).rolUsuario == 1) {
        this.userSesion = JSON.parse(sesion).nickname;
        this.obtenerGetPerfilCompleto(this.userSesion);
        const response = await this.apiService.protectedRequestWithToken(JSON.parse(sesion).token).toPromise(); // Convertir la respuesta a promesa con toPromise() y esperarla con await
        //this.chanceColorFooter();
        this.StatusBar();
        this.obtenerLikeTEjercicio();
        this.obtenerLikeOMuscular();
        this.obtenerBookMarkUser();
        this.obtenerContratoEntrenadoresUsuario();
        //this.obtenerEjercicios();
      } else {
        this.handleError();
      }
    } catch (error) {
      this.handleError();
    }
  }

  private handleError() {
    this.loading = false;
    this.navController.navigateForward('/error-page-users-trainers');
    this.storage.remove('sesion');
  }
/*   private chanceColorFooter(){
    document.documentElement.style.setProperty('--activate-foot10',' transparent');
    document.documentElement.style.setProperty('--activate-foot11',' #6b6a6b');
    document.documentElement.style.setProperty('--activate-foot20',' #9259f9');
    document.documentElement.style.setProperty('--activate-foot21',' #9259f9');
    document.documentElement.style.setProperty('--activate-foot30',' transparent');
    document.documentElement.style.setProperty('--activate-foot31',' #6b6a6b');
    document.documentElement.style.setProperty('--activate-foot40',' transparent');
    document.documentElement.style.setProperty('--activate-foot41',' #6b6a6b');
  } */

  getVideoName(url: string): string {
    return url.split('.')[0];
  }

  cargarImagenesBefores(){
    const Ejercicios = this.dataEjercicio;
    const imageUrls = [];
    if (Array.isArray(Ejercicios)) {
      for (let i = 0; i < Ejercicios.length; i++) {
        const nameImagen = this.getVideoName(Ejercicios[i].ALMACENAMIENTOMULTIMEDIA)+'.jpg';
        const imageUrl = this.ip_address+'/multimedia/'+nameImagen;
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

  toggleBookmarkTEjercicio(index: number): void {
    this.loading=true;
    if (this.LikeTEjercicioState[index]) {
      this.LikeTEjercicioState[index] = false;
      this.updateLikeTEjercicio(index,this.LikeTEjercicioState[index],'liketejercicio');
    } else {
      this.LikeTEjercicioState[index] = true;
      this.updateLikeTEjercicio(index,this.LikeTEjercicioState[index],'liketejercicio');
    }
    setTimeout(() => {
      this.loading=false;
    }, 500);
  }
  toggleBookmarkOMuscular(index: number): void {
    this.loading=true;
    if (this.LikeOMuscularState[index]) {
      this.LikeOMuscularState[index] = false;
      this.updateLikeTEjercicio(index,this.LikeOMuscularState[index],'likeobjetivomusculares');
    } else {
      this.LikeOMuscularState[index] = true;
      this.updateLikeTEjercicio(index,this.LikeOMuscularState[index],'likeobjetivomusculares');
    }
    setTimeout(() => {
      this.loading=false;
    }, 500);
  }

  MessagePremium(){
    this.presentCustomToast('Ejercicio Premium, Suscribase para acceder a ellos','warning');
  }
  go_page(name: string){
    this.dataBookMark=[];
    this.navController.navigateForward('/' + name, {
      queryParams: {
        variableParametro: ""
      }
    });
  }
  nivelChange(){
    if (this.valueNivel === 0) {
      this.dataEjercicio =this.dataEjercicioOrig;
      this.valueNivel = 1;
      this.dataEjercicio = this.dataEjercicio.filter(element => element.IDNIVELDIFICULTADEJERCICIO === 1);
    } else if (this.valueNivel === 1) {
      this.dataEjercicio =this.dataEjercicioOrig;
      this.dataEjercicio = this.dataEjercicio.filter(element => element.IDNIVELDIFICULTADEJERCICIO === 2);
      this.valueNivel = 2;
    } else if(this.valueNivel === 2) {
      this.dataEjercicio =this.dataEjercicioOrig;
      this.valueNivel = -1;
    } else{
      this.dataEjercicio =this.dataEjercicioOrig;
      this.dataEjercicio = this.dataEjercicio.filter(element => element.IDNIVELDIFICULTADEJERCICIO === 0);
      this.valueNivel = 0;
    }
    this.dataEjercicio.sort((a, b) => {
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
  toggleBookmark(index: number): void {
    this.loading=true;
    if (this.bookmarkState[index]) {
      this.bookmarkState[index] = false;
      this.updateBookMarkUser(index,this.bookmarkState[index]);
    } else {
      this.bookmarkState[index] = true;
      this.updateBookMarkUser(index,this.bookmarkState[index]);
    }
    setTimeout(() => {
      this.loading=false;
    }, 500);
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
  obtenerEjercicios(){
    this.apiService.getEjercicioActivate().subscribe(
      (response) => {
        this.dataEjercicio=response;
        if ( this.variable.IDTIPOEJERCICIO && this.variable.IDTIPOEJERCICIO!==null || this.variable.IDTIPOEJERCICIO!==undefined){
          this.dataEjercicio = this.dataEjercicio.filter(element => element.IDTIPOEJERCICIO === this.variable.IDTIPOEJERCICIO  );
        }else if (this.variable.IDOBJETIVOSMUSCULARES && this.variable.IDOBJETIVOSMUSCULARES!==null || this.variable.IDOBJETIVOSMUSCULARES!==undefined){
          this.dataEjercicio = this.dataEjercicio.filter(element => element.IDOBJETIVOMUSCULAR === this.variable.IDOBJETIVOSMUSCULARES );
        }
        this.dataEjercicio.forEach((ejercicio) => {
          ejercicio.CALORIASEJERCICIO= (this.obtenerDuracionEnMinutos(ejercicio.TIEMPOMULTIMEDIA)/60*ejercicio.METEJERCICIO*Number(this.userSesionPerfil[0].PESOUSUARIO)).toFixed(2);
          });
        const rawData = this.dataEjercicio;
        //this.dataEjercicioOrig = rawData.map(item => ({ ...item }));
        try {
          if (this.dataEntrenadorUsuarios && this.dataEntrenadorUsuarios.length > 0 && this.dataEjercicio && this.dataEjercicio.length>0) {
            this.dataEjercicio = this.dataEjercicio.filter(elemento =>{
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
          this.presentCustomToast('Error en Mostrar Ejercicios','danger');
        }
        if (this.dataEntrenadorUsuarios && this.dataEntrenadorUsuarios.length > 0 && this.dataEjercicio && this.dataEjercicio.length>0) {
        this.dataEjercicio.sort((a, b) => {
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
        this.dataEjercicioOrig = rawData.map(item => ({ ...item }));
        if (this.dataEjercicio && this.dataEjercicio.length>0)
        this.cargarImagenesBefores();
        else
        this.loading=false;
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
        this.obtenerEjercicios();
      },
      (error) => {
        this.presentCustomToast(error.error.error,"danger");
      }
    );
  }


  obtenerBookMarkUser(){
    this.apiService.allBookmark('bookmarkpersona').subscribe(
      (response) => {
        this.dataBookMark=response;
        this.dataBookMark= this.dataBookMark.filter(element=>element.IDPERSONA ===this.userSesionPerfil[0].IDPERSONA)
        this.dataBookMark.forEach(bookmark => {
          this.bookmarkState[bookmark.IDEJERCICIO] = true;
        });
      },
      (error) => {
        this.presentCustomToast(error.error.error,"danger");
      }
    );
  }
  updateBookMarkUser(idEjercicio:number,status:boolean){
    this.apiService.updateBookmarkpersona( idEjercicio,this.userSesionPerfil[0].IDPERSONA,status,'bookmarkpersona').subscribe(
      (response) => {
        this.presentCustomToast(response.message,"success");
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
  obtenerLikeOMuscular(){
    this.apiService.allBookmark('likeobjetivomusculares').subscribe(
      (response) => {
        this.dataLikeOMuscular=response;
        this.dataLikeOMuscular= this.dataLikeOMuscular.filter(element=>element.IDPERSONA ===this.userSesionPerfil[0].IDPERSONA)
        this.dataLikeOMuscular.forEach(liketejercicio => {
          this.LikeOMuscularState[liketejercicio.IDOBJETIVOSMUSCULARES] = true;
        });
      },
      (error) => {
        this.presentCustomToast(error.error.error,"danger");
      }
    );
  }
  obtenerLikeTEjercicio(){
    this.apiService.allBookmark('liketejercicio').subscribe(
      (response) => {
        this.dataLikeTEjercicio=response;
        this.dataLikeTEjercicio= this.dataLikeTEjercicio.filter(element=>element.IDPERSONA ===this.userSesionPerfil[0].IDPERSONA)
        this.dataLikeTEjercicio.forEach(liketejercicio => {
          this.LikeTEjercicioState[liketejercicio.IDTIPOEJERCICIO] = true;
        });
      },
      (error) => {
        this.presentCustomToast(error.error.error,"danger");
      }
    );
  }
}
