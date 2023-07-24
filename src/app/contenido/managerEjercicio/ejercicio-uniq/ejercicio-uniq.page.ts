import { Component, ViewChild, ElementRef , OnInit, OnDestroy } from '@angular/core';
import { IP_ADDRESS } from '../../../constantes';
import { StatusBar, StatusBarStyle } from '@capacitor/status-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController, ToastController, ViewDidEnter } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { ApiServiceService } from '../../../api-service.service';

@Component({
  selector: 'app-ejercicio-uniq',
  templateUrl: './ejercicio-uniq.page.html',
  styleUrls: ['./ejercicio-uniq.page.scss'],
})
export class EjercicioUniqPage implements OnInit,OnDestroy,ViewDidEnter  {
  @ViewChild('videoPlayer', { static: false }) videoPlayer!: ElementRef;

  public ip_address = IP_ADDRESS;

  public loading = true;
  public userSesion!:string;
  public userSesionPerfil!:any;

  bookmarkState: { [key: number]: boolean } = {};
  dataBookMark!:any[];

  videoSrc!:string;

  variable!:any;
  variableParamentro!:any;
  variableSesiones!:any;
  variableRutinaDiaria!:any;
  variableprogramarrutinas!:any;

  previusPageMain:boolean=false;
  previusPagelistarGuardados:boolean=false;
  previusPagelistarRutinasAll:boolean=false;
  previusPagelistarSesionesRutinasAll:boolean=false;
  previusPagelistarEjercicioAll:boolean=false;


  variableEjerciciositem:number=-1;
  variableEjercicios:any;

  variableRutinasitem:number=-1;
  variableRutinas:any;

  IDPROGRESOUSUARIO:number=-1;

  dataEjercicio!: any[];
  dataRutinas!: any[];

  constructor(private navController: NavController,
    private apiService: ApiServiceService,
    private storage: Storage,
    public toastController: ToastController,
    private route: ActivatedRoute,) {

 }

 ionViewDidEnter(){
    this.initializePage();
  }

  ngOnInit() {
    this.initializePage();
  }

  ngOnDestroy() {
    const videoElement = document.getElementById('videoPlayer') as HTMLVideoElement;
    if (videoElement && !videoElement.paused) {
      videoElement.pause();
    }
    this.inicio();
  }

  initializePage(){
    this.inicio();
    this.recuperarDatos();
    this.validateSesion();
    const videoUrl = this.ip_address + '/multimedia/' + this.variable?.ALMACENAMIENTOMULTIMEDIA;
    this.videoSrc = videoUrl;
    if(this.videoSrc!==''){
      if (this.videoPlayer && this.videoPlayer.nativeElement) {
        this.videoPlayer.nativeElement.load();
        this.videoPlayer.nativeElement.muted = true;
        this.videoPlayer.nativeElement.loop = true;
      }
    }
  }

  validateSesion(){
    try{
      this.storage.get('sesion').then((sesion) => {
        if (sesion && JSON.parse(sesion).rolUsuario == 1) {
          this.userSesion = JSON.parse(sesion).nickname;
          this.obtenerGetPerfilCompleto(this.userSesion);
          this.apiService.protectedRequestWithToken(JSON.parse(sesion).token).subscribe(
            (response) => {
              this.StatusBar();
              this.obtenerEjercicios();
              this.obtenerBookMarkUser();
              this.loading=false;
            },
            (error) => {
              this.handleError();
            }
          );
        } else {
          this.handleError();
        }
      });
    } catch (error) {
      this.handleError();
    }
  }

  StatusBar(){
    StatusBar.setOverlaysWebView({ overlay: true });
    StatusBar.setBackgroundColor({color:'transparent'});
    StatusBar.setStyle({ style: StatusBarStyle.Dark });
  }

  private handleError() {
    this.loading = false;
    this.navController.navigateForward('/error-users');
    this.storage.remove('sesion');
  }

  recuperarDatos(){
    this.route.queryParams.subscribe(params => {
      this.variable = params['variableEjercicio'] as any || null;
      this.variableParamentro = params['variableParametro'] as any || null;
      this.variableSesiones = params['variableSesiones'] as any || null;
      this.variableRutinaDiaria = params['variableRutinaDiaria'] as any || null;
      this.variableprogramarrutinas = params['variableprogramarrutinas'] as any || null;

      this.previusPageMain = params['previusPageMain'] as boolean || false;
      this.previusPagelistarGuardados = params['previusPagelistarGuardados'] as boolean || false;
      this.previusPagelistarRutinasAll= params['previusPagelistarRutinasAll'] as boolean || false;
      this.previusPagelistarSesionesRutinasAll= params['previusPagelistarSesionesRutinasAll'] as boolean || false;;
      this.previusPagelistarEjercicioAll= params['previusPagelistarEjercicioAll'] as boolean || false;

      this.variableRutinasitem = params['variableRutinasitem'] as number || -1;
      this.variableRutinas=params['variableRutinas'] as any ||null;

      this.variableEjerciciositem = params['variableEjerciciositem'] as number || -1;
      this.variableEjercicios = params['variableEjercicios'] as any ||null;

      this.IDPROGRESOUSUARIO= params['IDPROGRESOUSUARIO'] as number || -1;
    });
  }

  inicio(){
    this.videoSrc='';

    this.variable=null;
    this.variableParamentro=null;
    this.variableSesiones=null;
    this.variableRutinaDiaria=null;
    this.variableprogramarrutinas=null;

    this.previusPageMain=false;
    this.previusPagelistarGuardados=false;
    this.previusPagelistarRutinasAll=false;
    this.previusPagelistarSesionesRutinasAll=false;
    this.previusPagelistarEjercicioAll=false;

    this.IDPROGRESOUSUARIO=-1;
    this.variableEjerciciositem=-1;
    this.variableEjercicios=null;

    this.variableRutinasitem=-1;
    this.variableRutinas=null;
  }
  async nextRoutine(){
    await this.obtenerRutinas();
    if(this.variableRutinas.length<=this.dataRutinas.length){
      if(this.variableRutinasitem===-1){
        this.variableRutinasitem=0;
      }
      this.variableRutinasitem++;
      this.variableEjerciciositem=0;
    }
    this.variableRutinaDiaria =  this.dataRutinas.find((elemento) => elemento.IDRUTINA === this.variableprogramarrutinas.IDRUTINAS[this.variableRutinasitem]);
    const elementoEncontrado = this.dataEjercicio.find(item => item.IDEJERCICIO === this.variableRutinaDiaria.IDEJERCICIOS[this.variableEjerciciositem]);

    const videoUrl = this.ip_address + '/multimedia/' + elementoEncontrado?.ALMACENAMIENTOMULTIMEDIA;
    this.videoSrc = videoUrl;

    this.videoPlayer.nativeElement.load();
    this.videoPlayer.nativeElement.muted = true;
    this.videoPlayer.nativeElement.loop = true;

    this.navController.navigateRoot('/ejercicio-uniq', {
      queryParams: {

        variableVideosEjercicio:elementoEncontrado,
        variableEjercicio: elementoEncontrado,

        variableParametro:this.variableParamentro,
        variableRutinaDiaria :this.variableRutinaDiaria,
        variableprogramarrutinas:this.variableprogramarrutinas,
        variableSesiones: this.variableSesiones,

        previusPageMain:this.previusPageMain,
        previusPagelistarGuardados:this.previusPagelistarGuardados,
        previusPagelistarRutinasAll: this.previusPagelistarRutinasAll,
        previusPagelistarSesionesRutinasAll:this.previusPagelistarSesionesRutinasAll,
        previusPagelistarEjercicioAll:this.previusPagelistarEjercicioAll,

        variableEjercicios :this.variableRutinaDiaria.IDEJERCICIOS,
        variableEjerciciositem:this.variableEjerciciositem,

        variableRutinasitem:this.variableRutinasitem,
        variableRutinas:this.variableRutinas,

        IDPROGRESOUSUARIO: this.IDPROGRESOUSUARIO,
      },
    });
  }

  async previusRoutine(){
    await this.obtenerRutinas();
    if(this.variableRutinasitem===-1){
      this.variableRutinasitem=0;
    }
    this.variableRutinasitem--;

    this.variableRutinaDiaria =  this.dataRutinas.find((elemento) => elemento.IDRUTINA === this.variableprogramarrutinas.IDRUTINAS[this.variableRutinasitem]);
    this.variableEjerciciositem = this.variableRutinaDiaria && this.variableRutinaDiaria.IDEJERCICIOS.length-1;
    const elementoEncontrado = this.dataEjercicio.find(item => item.IDEJERCICIO === this.variableRutinaDiaria.IDEJERCICIOS[this.variableEjerciciositem]);

    const videoUrl = this.ip_address + '/multimedia/' + elementoEncontrado?.ALMACENAMIENTOMULTIMEDIA;
    this.videoSrc = videoUrl;

    this.videoPlayer.nativeElement.load();
    this.videoPlayer.nativeElement.muted = true;
    this.videoPlayer.nativeElement.loop = true;

    this.navController.navigateRoot('/ejercicio-uniq', {
      queryParams: {

        variableVideosEjercicio:elementoEncontrado,
        variableEjercicio: elementoEncontrado,

        variableParametro:this.variableParamentro,
        variableRutinaDiaria :this.variableRutinaDiaria,
        variableprogramarrutinas:this.variableprogramarrutinas,
        variableSesiones: this.variableSesiones,

        previusPageMain:this.previusPageMain,
        previusPagelistarGuardados:this.previusPagelistarGuardados,
        previusPagelistarRutinasAll: this.previusPagelistarRutinasAll,
        previusPagelistarSesionesRutinasAll:this.previusPagelistarSesionesRutinasAll,
        previusPagelistarEjercicioAll:this.previusPagelistarEjercicioAll,

        variableEjercicios :this.variableRutinaDiaria.IDEJERCICIOS,
        variableEjerciciositem:this.variableEjerciciositem,

        variableRutinasitem:this.variableRutinasitem,
        variableRutinas:this.variableRutinas,

        IDPROGRESOUSUARIO: this.IDPROGRESOUSUARIO,
      },
    });
  }

  nextEjercicio() {
    if(this.variableEjerciciositem===-1){
      this.variableEjerciciositem=0;
    }
    this.variableEjerciciositem++;
    const elementoEncontrado = this.dataEjercicio.find(item => item.IDEJERCICIO === this.variableEjercicios[this.variableEjerciciositem]);
    const videoUrl = this.ip_address + '/multimedia/' + elementoEncontrado?.ALMACENAMIENTOMULTIMEDIA;
    this.videoSrc = videoUrl;

    this.videoPlayer.nativeElement.load();
    this.videoPlayer.nativeElement.muted = true;
    this.videoPlayer.nativeElement.loop = true;
    this.navController.navigateRoot('/ejercicio-uniq', {
      queryParams: {
        variableEjercicio: elementoEncontrado,
        variableParametro: this.variableParamentro,
        variableRutinaDiaria: this.variableRutinaDiaria,
        variableprogramarrutinas: this.variableprogramarrutinas,
        variableSesiones: this.variableSesiones,

        previusPageMain: this.previusPageMain,
        previusPagelistarGuardados: this.previusPagelistarGuardados,
        previusPagelistarRutinasAll: this.previusPagelistarRutinasAll,
        previusPagelistarSesionesRutinasAll: this.previusPagelistarSesionesRutinasAll,
        previusPagelistarEjercicioAll: this.previusPagelistarEjercicioAll,

        variableRutinasitem:this.variableRutinasitem,
        variableRutinas:this.variableRutinas,

        variableEjercicios: this.variableEjercicios,
        variableEjerciciositem:this.variableEjerciciositem,

        IDPROGRESOUSUARIO:this.IDPROGRESOUSUARIO,
      },
    });
  }
  previusEjercicio() {
    this.variableEjerciciositem --;
    const elementoEncontrado = this.dataEjercicio.find(item => item.IDEJERCICIO === this.variableEjercicios[this.variableEjerciciositem]);

    const videoUrl = this.ip_address + '/multimedia/' + elementoEncontrado?.ALMACENAMIENTOMULTIMEDIA;
    this.videoSrc = videoUrl;

    this.videoPlayer.nativeElement.load();
    this.videoPlayer.nativeElement.muted = true;
    this.videoPlayer.nativeElement.loop = true;

    this.navController.navigateRoot('/ejercicio-uniq' , {
      queryParams: {
        variableEjercicio: elementoEncontrado,
        variableParametro:this.variableParamentro,
        variableRutinaDiaria:this.variableRutinaDiaria,
        variableprogramarrutinas:this.variableprogramarrutinas,
        variableSesiones:this.variableSesiones,

        previusPageMain:this.previusPageMain,
        previusPagelistarGuardados:this.previusPagelistarGuardados,
        previusPagelistarRutinasAll:this.previusPagelistarRutinasAll,
        previusPagelistarSesionesRutinasAll:this.previusPagelistarSesionesRutinasAll,
        previusPagelistarEjercicioAll:this.previusPagelistarEjercicioAll,

        variableRutinasitem:this.variableRutinasitem,
        variableRutinas:this.variableRutinas,

        variableEjercicios:this.variableEjercicios,
        variableEjerciciositem:this.variableEjerciciositem,

        IDPROGRESOUSUARIO:this.IDPROGRESOUSUARIO,
      },
    });
  }

  handleButtonClick(): void {
    this.variable = '';
    if (this.variableRutinaDiaria && !this.previusPagelistarSesionesRutinasAll && !this.previusPageMain && !this.variableprogramarrutinas) {
      this.go_page('rutinas-diarias');
    } else if (this.variableprogramarrutinas && !this.previusPagelistarSesionesRutinasAll && !this.previusPageMain) {
      this.go_page('programarrutinas');
    } else if (this.variableParamentro) {
      this.go_page('listar-parametros');
    } else if (this.previusPageMain){
      this.go_page('main');
    }else if(this.previusPagelistarGuardados){
      this.go_page('listar-guardados');
    }else if(this.previusPagelistarEjercicioAll){
      this.go_page('listar-ejercicios-all');
    }else if(this.previusPagelistarSesionesRutinasAll){
      this.go_page('listar-sesiones-all');
    }else if(this.previusPagelistarRutinasAll){
      this.go_page('listar-rutinas-all');
    }
  }

  go_page(name: string){
    if(this.variableRutinaDiaria && !this.previusPagelistarSesionesRutinasAll  && !this.previusPageMain && !this.variableprogramarrutinas){
      this.navController.navigateForward('/' + name, {
        queryParams: {
          variableVideosEjercicio:null,
          variableEjercicio: null,
          variableRutinaDiaria:this.variableRutinaDiaria,
          variableSesiones:this.variableSesiones,
          previusPageMain :this.previusPageMain,
          previusPagelistarGuardados:this.previusPagelistarGuardados,
          variableParametro:null,
          variableprogramarrutinas:null,
          variableRutinasitem:-1,
          variableRutinas:null,
          variableEjerciciositem : -1,
          variableEjercicios:null,
          IDPROGRESOUSUARIO:-1,
        }
      });
    }else if (this.variableParamentro){
      this.navController.navigateForward('/' + name, {
        queryParams: {
          variableVideosEjercicio:null,
          variableEjercicio: null,
          variableRutinaDiaria:null,
          variableSesiones:null,
          previusPageMain :this.previusPageMain,
          previusPagelistarGuardados:this.previusPagelistarGuardados,
          variableParametro:this.variableParamentro,
          variableprogramarrutinas:null,
          variableRutinasitem:-1,
          variableRutinas:null,
          variableEjerciciositem : -1,
          variableEjercicios:null,
          IDPROGRESOUSUARIO:-1,
        }
      });
    }else if(this.variableprogramarrutinas && !this.previusPagelistarSesionesRutinasAll && !this.previusPageMain){
      this.navController.navigateForward('/' + name, {
        queryParams: {
          variableVideosEjercicio:null,
          variableEjercicio: null,
          variableRutinaDiaria:null,
          variableSesiones:this.variableSesiones,
          previusPageMain :this.previusPageMain,
          previusPagelistarGuardados:this.previusPagelistarGuardados,
          variableParametro:null,
          variableprogramarrutinas:this.variableprogramarrutinas,
          variableRutinasitem:-1,
          variableRutinas:null,
          variableEjerciciositem : -1,
          variableEjercicios:null,
          IDPROGRESOUSUARIO:-1,
        }
      });
    }else if(this.previusPageMain){
      this.navController.navigateForward('/' + name, {
        queryParams: {
          variableVideosEjercicio:null,
          variableEjercicio: null,
          variableRutinaDiaria:null,
          variableSesiones:null,
          previusPageMain :this.previusPageMain,
          previusPagelistarGuardados:"",
          variableParametro:null,
          variableprogramarrutinas:"",
          variableRutinasitem:-1,
          variableRutinas:null,
          variableEjerciciositem : -1,
          variableEjercicios:null,
          IDPROGRESOUSUARIO:-1,
        }
      });
    }else if(this.previusPagelistarGuardados){
      this.navController.navigateForward('/' + name, {
        queryParams: {
          variableVideosEjercicio:null,
          variableEjercicio: null,
          variableRutinaDiaria:null,
          variableSesiones:null,
          previusPageMain :false,
          previusPagelistarGuardados:this.previusPagelistarGuardados,
          variableParametro:null,
          variableprogramarrutinas:null,
          variableRutinasitem:-1,
          variableRutinas:null,
          variableEjerciciositem : -1,
          variableEjercicios:null,
          IDPROGRESOUSUARIO:-1,
        }
      });
    }else if(this.previusPagelistarEjercicioAll){
      this.navController.navigateForward('/' + name, {
        queryParams: {
          variableVideosEjercicio:null,
          variableEjercicio: null,
          variableRutinaDiaria:null,
          variableSesiones:null,
          previusPageMain :false,
          previusPagelistarEjercicioAll:this.previusPagelistarEjercicioAll,
          variableParametro:null,
          variableprogramarrutinas:null,
          variableRutinasitem:-1,
          variableRutinas:null,
          variableEjerciciositem : -1,
          variableEjercicios:null,
          IDPROGRESOUSUARIO:-1,
        }
      });
    }else if(this.previusPagelistarRutinasAll){
      this.navController.navigateForward('/' + name, {
        queryParams: {
          variableVideosEjercicio:null,
          variableEjercicio: null,
          variableRutinaDiaria:this.variableRutinaDiaria,
          variableSesiones:this.variableSesiones,
          previusPageMain :this.previusPageMain,
          previusPagelistarGuardados:this.previusPagelistarGuardados,
          variableParametro:null,
          variableprogramarrutinas:null,
          previusPagelistarRutinasAll:this.previusPagelistarRutinasAll,
          variableRutinasitem:-1,
          variableRutinas:null,
          variableEjerciciositem : -1,
          variableEjercicios:null,
          IDPROGRESOUSUARIO:-1,
        }
      });
    }else if(this.previusPagelistarSesionesRutinasAll){
      this.navController.navigateForward('/' + name, {
        queryParams: {
          variableVideosEjercicio:null,
          variableEjercicio: null,
          variableRutinaDiaria:null,
          variableSesiones:this.variableSesiones,
          previusPageMain :this.previusPageMain,
          previusPagelistarGuardados:this.previusPagelistarGuardados,
          variableParametro:null,
          variableprogramarrutinas:this.variableprogramarrutinas,
          previusPagelistarSesionesRutinasAll:this.previusPagelistarSesionesRutinasAll,
          variableRutinasitem:-1,
          variableRutinas:null,
          variableEjerciciositem : -1,
          variableEjercicios:null,
          IDPROGRESOUSUARIO:-1,
        }
      });
    }
  }
  go_next_page(){
    const name='video-uniq';
    this.navController.navigateForward('/' + name, {
      queryParams: {
        variableVideosEjercicio: this.variable,

        variableEjercicio:this.variable,
        variableParametro:this.variableParamentro,
        variableSesiones: this.variableSesiones,
        variableRutinaDiaria :this.variableRutinaDiaria,
        variableprogramarrutinas:this.variableprogramarrutinas,

        previusPageMain:this.previusPageMain,
        previusPagelistarGuardados:this.previusPagelistarGuardados,
        previusPagelistarRutinasAll: this.previusPagelistarRutinasAll,
        previusPagelistarSesionesRutinasAll:this.previusPagelistarSesionesRutinasAll,
        previusPagelistarEjercicioAll:this.previusPagelistarEjercicioAll,

        variableRutinasitem:this.variableRutinasitem,
        variableRutinas:this.variableRutinas,

        variableEjerciciositem:this.variableEjerciciositem,
        variableEjercicios :this.variableEjercicios,

        IDPROGRESOUSUARIO:this.IDPROGRESOUSUARIO,
      }
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

  obtenerEjercicios(){
    this.apiService.getEjercicioActivate().subscribe(
      (response) => {
        this.dataEjercicio=response;
        this.dataEjercicio.forEach((ejercicio) => {
        ejercicio.CALORIASEJERCICIO= (this.obtenerDuracionEnMinutos(ejercicio.TIEMPOMULTIMEDIA)/60*ejercicio.METEJERCICIO*Number(this.userSesionPerfil[0].PESOUSUARIO)).toFixed(2);
        });
      },
      (error) => {
        this.presentCustomToast(error.error.error,"danger");
      }
    );
  }

  async obtenerRutinas() {
    try {
      const response = await this.apiService.getRutinasActivate().toPromise();
      this.dataRutinas = response;
      this.dataRutinas = this.dataRutinas.map(objeto => ({
        ...objeto,
        IDEJERCICIOS: objeto.IDEJERCICIOS.split(",").map(Number)
      }));
    } catch (error:any) {
      this.presentCustomToast(error.error.error, "danger");
    }
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
}
