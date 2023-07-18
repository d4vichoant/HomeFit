import { Component, OnInit } from '@angular/core';
import { IP_ADDRESS } from '../../../constantes';
import { Storage } from '@ionic/storage-angular';
import { ApiServiceService } from '../../../api-service.service';
import { ActivatedRoute } from '@angular/router';
import { NavController, ToastController } from '@ionic/angular';
import { StatusBar } from '@capacitor/status-bar';
import { Observable } from 'rxjs';
import { map, catchError, throwError } from 'rxjs';

@Component({
  selector: 'app-video-uniq',
  templateUrl: './video-uniq.page.html',
  styleUrls: ['./video-uniq.page.scss'],
})
export class VideoUniqPage implements OnInit {
  public userSesion!:string;
  public userSesionPerfil!:any;
  public loading = true;

  variableVideosEjercicio!:any;
  activatevariableVideosEjercicio:boolean=false;
  variable!:any;
  variableEjercicios!:any[];
  variableEjerciciositem!:number;
  variableRutinaDiaria!:any;
  variableprogramarrutinas!:any;
  variableParamentro!:any;
  previusPagelistarGuardados!:any;
  previusPageMain!:any;
  variableSesiones!:any;

  public ip_address = IP_ADDRESS;

  showControls:boolean=true;
  showButtonPause:boolean=true;
  showButtonSound:boolean=true;

  mainProgress: number;
  videoElement!: HTMLVideoElement;
  previusPagelistarRutinasAll!:any;
  previusPagelistarSesionesRutinasAll!:any;
  previusPagelistarEjercicioAll!:any;

  videoSrc!:string;
  previousVideoSrc!: string

  timer: any;
  inactivityThreshold: number = 1500;

  startTime!: number;
  elapsedTime!: { hours: number, minutes: number, seconds: number };
  buttonClickTime!: number;

  showButtonNext:boolean=false;
  showTextRepeticion:boolean=false;
  showTextRepeticionAnime:boolean=false;
  showTextInformation:boolean=false;

  initialTimeButtonActivated = false;
  middleTimeButtonActivated = false;
  finalTimeButtonActivated = false;

  showmodalstars:boolean=false;
  showmodalstarsActivate:boolean=false;
  evaluateComment:number=0;
  validatebuttonEvaluate:boolean=false;

  messageText!:string;
  showmessageText:boolean=false;
  showmessageTextAnimate:boolean=false;

  currentTime: number = 0;
  currentPercentage: number = 0;

  IDPROGRESOUSUARIO!:number;
  constructor(
    private route: ActivatedRoute,
    private apiService: ApiServiceService,
    private storage: Storage,
    private navController: NavController,
    public toastController: ToastController,
  ) {
    this.mainProgress = 0;
    setTimeout(() => {
      this.showControls=false;
    }, 500);
    this.showButtonNext = false;
    this.showTextRepeticion = false;
    this.showTextRepeticionAnime = false;
    this.initialTimeButtonActivated = false;
    this.middleTimeButtonActivated = false;
    this.finalTimeButtonActivated = false;
    this.inicio();
  }

  ngOnInit()
  {
    this.startTime = Date.now();
    this.mainProgress = 0;
    this.inicio();
    try {
      this.recuperarDatos();
      this.validateSesion();
      //this.test();
      this.videoSrc=this.ip_address + '/multimedia/' + this.variableVideosEjercicio?.ALMACENAMIENTOMULTIMEDIA;
      window.addEventListener("orientationchange", this.onOrientationChange);
      this.performVideoAction('reset');
    } catch (error) {
      this.handleError();
    }
  }

  ngOnDestroy() {
    window.removeEventListener("orientationchange", this.onOrientationChange);
  }

  ionViewDidEnter() {
    this.mainProgress = 0;
    this.inicio();
    this.startTime = Date.now();
    try {
      this.recuperarDatos();
      this.validateSesion();
      //this.test();
      this.videoSrc=this.ip_address + '/multimedia/' + this.variableVideosEjercicio?.ALMACENAMIENTOMULTIMEDIA;
      window.addEventListener("orientationchange", this.onOrientationChange);
      this.performVideoAction('reset');
    } catch (error) {
      this.handleError();
    }
  }
  test(){
    this.StatusBar();
    this.loading=false;
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
  private handleError() {
    this.loading = false;
    this.navController.navigateForward('/error-page-users-trainers');
    this.storage.remove('sesion');
  }

  recuperarDatos(){
    this.route.queryParams.subscribe(params => {
      this.variableVideosEjercicio = params['variableVideosEjercicio'] as any || null;
      this.variable = params['variableEjercicio'] as any || null;
      this.variableParamentro = params['variableParametro'] as any || null;
      this.variableRutinaDiaria = params['variableRutinaDiaria'] as any || null;
      this.variableprogramarrutinas = params['variableprogramarrutinas'] as any || null;
      this.variableSesiones = params['variableSesiones'] as any || null;
      this.previusPageMain = params['previusPageMain'] as any || null;
      this.previusPagelistarGuardados = params['previusPagelistarGuardados'] as any || null;
      this.variableEjercicios = params['variableEjercicios'] as any ||null;
      this.variableEjerciciositem = params['variableEjerciciositem'] as number;
      this.previusPagelistarRutinasAll= params['previusPagelistarRutinasAll'] as any || null;
      this.previusPagelistarSesionesRutinasAll= params['previusPagelistarSesionesRutinasAll'] as any || null;;
      this.previusPagelistarEjercicioAll= params['previusPagelistarEjercicioAll'] as any || null;
    });
    if(!this.activatevariableVideosEjercicio){
      this.variableVideosEjercicio.INTRUCCIONESEJERCICIO = this.procesarTexto(this.variableVideosEjercicio.INTRUCCIONESEJERCICIO);
      this.activatevariableVideosEjercicio=true;
    }
  }

  StatusBar(){
    StatusBar.hide();
    StatusBar.setOverlaysWebView({ overlay: true });
    StatusBar.setBackgroundColor({ color: '#232123' });
  }

  onVideoEnded(event: Event): void {
    this.showControls=false;
    if(!this.showmodalstarsActivate){
      this.showmodalstars=true;
      this.showmodalstarsActivate=true;
    }
  }
  onOrientationChange() {
    const orientation = window.orientation;
    const videoContainer = document.getElementById("video-container");
    if (videoContainer) {
      if (orientation === 90 || orientation === -90) {
        videoContainer.classList.add("horizontal");
      } else {
        videoContainer.classList.remove("horizontal");
      }
    }
  }

  onVideoTimeUpdate(event: Event): void {
    this.showmodalstars=false;
    const video = event.target as HTMLVideoElement;
    this.videoElement = video;
    this.currentTime = video.currentTime;
    const duration = video.duration;

    const newVideoSrc = this.ip_address + '/multimedia/' + this.variableVideosEjercicio?.ALMACENAMIENTOMULTIMEDIA;

    if (newVideoSrc !== this.previousVideoSrc) {
      this.videoSrc = newVideoSrc;
      this.videoElement.load();
      this.performVideoAction('play');
      this.previousVideoSrc = newVideoSrc;
    }

    if (duration > 0) {
      this.currentPercentage = (this.currentTime / duration) * 100;
    } else {
      this.currentPercentage = 0;
    }

    const mainProgressBar = document.querySelector('.progress-bar .progress-line') as HTMLElement;

    this.mainProgress = (video.currentTime / video.duration) * 100;
    if (mainProgressBar) {
      mainProgressBar.style.width = this.mainProgress + '%';
    }

    const durationElement = document.getElementById('duration');
    const currentTimeElement = document.getElementById('currentTime');

    if (durationElement) {
      durationElement.textContent = this.formatTime(video.duration);
    }

    if (currentTimeElement) {
      currentTimeElement.textContent = this.formatTime(video.currentTime);
    }

    const remainingTime = video.duration - video.currentTime;
    if (remainingTime <= 5) {
      if(!this.showButtonNext){
        this.showButtonNext=true;
      }
    }

    const initialTime = 1; // Establece el tiempo en segundos
    const tolerance = 0.1;
    if (Math.abs(video.currentTime - initialTime) <= tolerance && !this.initialTimeButtonActivated) {
      this.showTextRepeticion = true;
      this.showTextRepeticionAnime=true;
      setTimeout(() => {
        this.showTextRepeticionAnime=false;
      }, 2000);

      setTimeout(() => {
        this.showTextRepeticion=false;
      }, 2400);

      this.initialTimeButtonActivated = true;
    }

    // Para la parte media:
    const videoDuration = video.duration;
    const middleTime = videoDuration / 2; // Establece la mitad de la duración del video

    if (Math.abs(video.currentTime - middleTime) <= tolerance && !this.middleTimeButtonActivated) {
      this.showTextRepeticion = true;
      this.showTextRepeticionAnime=true;
      setTimeout(() => {
        this.showTextRepeticionAnime=false;
      }, 2000);

      setTimeout(() => {
        this.showTextRepeticion=false;
      }, 2400);
      this.middleTimeButtonActivated = true;
    }

    const finalTime = videoDuration - 7; // Establece el tiempo en segundos antes del final

    if (Math.abs(video.currentTime - finalTime) <= tolerance && !this.finalTimeButtonActivated) {
      this.showTextRepeticion = true;
      this.showTextRepeticionAnime=true;
      setTimeout(() => {
        this.showTextRepeticionAnime=false;
      }, 2000);

      setTimeout(() => {
        this.showTextRepeticion=false;
      }, 2400);
      this.finalTimeButtonActivated = true;
    }

  }


  onAdditionalProgressClick(event: MouseEvent): void {
    const isLandscape = window.innerWidth > window.innerHeight;
    if (isLandscape) {
      if (this.videoElement) {
        const progressBar = document.querySelector('.progress-bar') as HTMLElement;
        const rect = progressBar.getBoundingClientRect();
        const clickX = event.clientX - rect.left;
        //const clickY = event.clientY - rect.top;
        const progressWidth = progressBar.offsetWidth;
        const progressHeight = progressBar.offsetHeight;
        const clickedProgress = (clickX / progressWidth) * 100;
        const seekTime = (this.videoElement.duration * clickedProgress) / 100;

        const maxSeekTime = this.videoElement.duration;
        const timeToSeek = Math.min(seekTime, maxSeekTime);
        const minSeekTime = 0;

        // Verificar si el usuario intenta saltar adelante en el video
        if (timeToSeek > this.videoElement.currentTime) {
          // Verificar si el tiempo de búsqueda está dentro de la duración total
          if (timeToSeek <= maxSeekTime) {
            this.videoElement.currentTime = timeToSeek;
            this.videoElement.play(); // Reproducir el video
            this.showButtonPause = true;
          }
        }
        // Verificar si el usuario intenta saltar hacia atrás en el video
        else if (timeToSeek < this.videoElement.currentTime) {
          // Verificar si el tiempo de búsqueda está dentro de la duración total
          if (timeToSeek >= minSeekTime) {
            this.videoElement.currentTime = timeToSeek;
            this.videoElement.play(); // Reproducir el video
            this.showButtonPause = true;
          }
        }
      }
    } else {
      // Acciones para orientación vertical (modo retrato)
      if (this.videoElement) {
        const progressBar = document.querySelector('.progress-bar') as HTMLElement;
        const rect = progressBar.getBoundingClientRect();
        //const clickX = event.clientX - rect.left;
        const clickY = rect.bottom - event.clientY;
        const progressWidth = progressBar.offsetWidth;
        const progressHeight = progressBar.offsetHeight;
        const clickedProgress = (clickY / progressWidth) * 100;
        const seekTime = (this.videoElement.duration * clickedProgress) / 100;

        const maxSeekTime = this.videoElement.duration;
        const timeToSeek = Math.min(seekTime, maxSeekTime);
        const minSeekTime = 0;

        // Verificar si el usuario intenta saltar adelante en el video
        if (timeToSeek > this.videoElement.currentTime) {
          // Verificar si el tiempo de búsqueda está dentro de la duración total
          if (timeToSeek <= maxSeekTime) {
            this.videoElement.currentTime = timeToSeek;
            this.videoElement.play(); // Reproducir el video
            this.showButtonPause = true;
          }
        }
        // Verificar si el usuario intenta saltar hacia atrás en el video
        else if (timeToSeek < this.videoElement.currentTime) {
          // Verificar si el tiempo de búsqueda está dentro de la duración total
          if (timeToSeek >= minSeekTime) {
            this.videoElement.currentTime = timeToSeek;
            this.videoElement.play(); // Reproducir el video
            this.showButtonPause = true;
          }
        }
      }
    }
  }

  async go_page(name:string){
    this.loading=true;
    if(name!=='half-time'){
      this.performVideoAction('reset');
    }
    this.performVideoAction('pausar');
    this.EjercicioTerminador();
    let progress_show=true;
    console.log(this.currentPercentage);
    if(this.variableEjercicios && this.variableEjercicios.length>0){
      this.currentPercentage=(this.currentPercentage/100)*((this.variableEjerciciositem+1)/this.variableEjercicios.length)*100;
    }
    if(this.currentPercentage>=90){
      progress_show=false;
    }
    this.IDPROGRESOUSUARIO= await this.createDataProgresoUsuario(this.IDPROGRESOUSUARIO ,this.variableVideosEjercicio && this.variableVideosEjercicio.IDEJERCICIO, this.variableRutinaDiaria && this.variableRutinaDiaria.IDRUTINA, this.variableprogramarrutinas && this.variableprogramarrutinas.IDSESION, this.variableEjerciciositem, null, this.userSesionPerfil[0].IDUSUARIO,
      this.elapsedTime.hours + ':' + this.elapsedTime.minutes + ':' + this.elapsedTime.seconds,
      this.currentPercentage, progress_show);
    this.navController.navigateForward('/' + name, {
      queryParams: {
        variableEjercicio: this.variable,
        variableVideosEjercicio:this.variableVideosEjercicio,
        variableParametro:this.variableParamentro,
        variableRutinaDiaria :this.variableRutinaDiaria,
        variableprogramarrutinas:this.variableprogramarrutinas,
        variableSesiones: this.variableSesiones,
        previusPageMain:this.previusPageMain,
        previusPagelistarGuardados:this.previusPagelistarGuardados,
        variableEjercicios :this.variableEjercicios,
        variableEjerciciositem:this.variableEjerciciositem,
        previusPagelistarRutinasAll: this.previusPagelistarRutinasAll,
        previusPagelistarSesionesRutinasAll:this.previusPagelistarSesionesRutinasAll,
        previusPagelistarEjercicioAll:this.previusPagelistarEjercicioAll,
        IDPROGRESOUSUARIO:this.IDPROGRESOUSUARIO,
      }
    });
      this.inicio();
      this.loading=false;
/*     this.IDPROGRESOUSUARIO = this.createDataProgresoUsuario(this.variableVideosEjercicio && this.variableVideosEjercicio.IDEJERCICIO,this.variableRutinaDiaria && this.variableRutinaDiaria.IDRUTINA,this.variableprogramarrutinas && this.variableprogramarrutinas.IDSESION,this.variableEjerciciositem,null,this.userSesionPerfil[0].IDUSUARIO,
      this.elapsedTime.hours +':'+this.elapsedTime.minutes+':'+this.elapsedTime.seconds,
    this.currentPercentage,progress_show); */

  }
  inicio(){
    this.currentPercentage=0;
    this.currentTime=0;

    this.activatevariableVideosEjercicio=false;

    this.showButtonNext=false;
    this.showTextRepeticion=false;
    this.showTextRepeticionAnime=false;
    this.showTextInformation=false;

    this.showControls=true;
    this.showButtonPause=true;
    this.showButtonSound=true;

    this.initialTimeButtonActivated = false;
    this.middleTimeButtonActivated = false;
    this.finalTimeButtonActivated = false;

    this.mainProgress=0;

    this.timer= null;

    this.showmodalstars=false;
    this.showmodalstarsActivate=false;
    this.evaluateComment=0;
    this.validatebuttonEvaluate=false;

    this.messageText='';
    this.showmessageText=false;
    this.showmessageTextAnimate=false;

    this.startTime=0;
    this.buttonClickTime= 0;

    this.variable=null;
    this.variableVideosEjercicio = null;
    this.variableParamentro = null;
    this.variableRutinaDiaria = null;
    this.variableprogramarrutinas = null;
    this.variableSesiones = null;
    this.previusPageMain = null;
    this.previusPagelistarGuardados = null;
    this.variableEjercicios = [];
    this.variableEjerciciositem = -1;
    this.previusPagelistarRutinasAll = null;
    this.previusPagelistarSesionesRutinasAll = null;
    this.previusPagelistarEjercicioAll = null;
  }
  resetTimer(): void {
    setTimeout(() => {
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        if(this.showControls){
          this.showControls=false;
        }
      }, this.inactivityThreshold);
    }, 1500);
  }

  startTimer(): void {
    clearTimeout(this.timer);
  }

  clearcomentarioentrenador(){
    this.showmodalstars=false;
    this.evaluateComment=0;
    this.validatebuttonEvaluate=false;
    this.showControls=true;
  }

  insertarEvaluacionEjercicio(){
    const data={
      IDEJERCICIO:this.variableVideosEjercicio.IDEJERCICIO,
      IDUSUARIO:this.userSesionPerfil[0].IDUSUARIO,
      CALIFICACIONPROGRESO:this.evaluateComment-2
    }
    this.apiService.insertarCalificaionEjercicio(data).subscribe(
      (response:any) => {
        this.messageText=response.message;
        this.showmessageText = true;
        this.showmessageTextAnimate=true;
        setTimeout(() => {
          this.showmessageTextAnimate=false;
        }, 2000);

        setTimeout(() => {
          this.showmessageText=false;
        }, 2400);

        //this.presentCustomToast(response.message+'',"success");
        this.clearcomentarioentrenador();
      },
      (error) => {
        this.presentCustomToast(error.error.error,"danger");
      }
    );
  }
  changeStart(number:number){
    this.evaluateComment=number;
    if(!this.validatebuttonEvaluate){
      this.validatebuttonEvaluate=true;
    }
  }

  performVideoAction(action: string): void {
    switch (action) {
      case 'pausar':
        if (this.videoElement) {
          this.videoElement.pause();
          this.showButtonPause=false;
        }
        break;
      case 'play':
        if (this.videoElement) {
          this.videoElement.play();
          this.showButtonPause=true;
        }
        break;
      case 'sound':
        if (this.videoElement) {
          this.showButtonSound=!this.showButtonSound;
          this.videoElement.muted = false;
        }
        break;
      case 'muted':
        if (this.videoElement) {
          this.showButtonSound=!this.showButtonSound;
          this.videoElement.muted = true;
        }
        break;
      case 'adelantar':
        if (this.videoElement) {
          const currentTime = this.videoElement.currentTime;
          const duration = this.videoElement.duration;
          const newTime = Math.min(currentTime + 10, duration);
          this.videoElement.currentTime = newTime;
        }
        break;
      case 'retroceder':
        if (this.videoElement) {
          const currentTime = this.videoElement.currentTime;
          const newTime = Math.max(currentTime - 10, 0);
          this.videoElement.currentTime = newTime;
        }
        break;
      case 'reset':
        if (this.videoElement) {
          this.videoElement.currentTime = 0; // Reiniciar la reproducción desde el principio
          this.videoElement.play(); // Reproducir el video
          this.showButtonPause = true;
        }
        break;
      case 'information':
        this.showTextInformation=true;
        this.showControls=false;
        this.showmodalstars=false;
        this.videoElement.pause();
        break;
      case 'noinformation':
      this.showTextInformation=false;
      this.showControls=true;
      this.showmodalstars=false;
      this.videoElement.play();
        break;
      default:
        this.presentCustomToast('Acción no reconocida','warning');
    }
  }

  procesarTexto(texto: string): string {
    // Reemplazar los puntos por un punto y salto de línea
    let textoProcesado = texto.replace(/\./g, '.\n•');

    // Añadir un círculo al principio del texto
    textoProcesado = '•\n ' + textoProcesado;

    return textoProcesado;
  }

  EjercicioTerminador(){
    if (!this.buttonClickTime) {
      this.buttonClickTime = Date.now() - this.startTime;
    }

    const totalSeconds = Math.floor(this.buttonClickTime / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    this.elapsedTime = {
      hours: hours,
      minutes: minutes,
      seconds: seconds
    };

  }

formatTime(time: number): string {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  const formattedTime = `${this.padZero(minutes)}:${this.padZero(seconds)}`;
  return formattedTime;
}

padZero(value: number): string {
  return value.toString().padStart(2, '0');
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



  async createDataProgresoUsuario(IDPROGRESOUSUARIO:any,IDEJERCICIO: any, IDRUTINA: any, IDSESION: any, progress_numeroEjercicio: any,
    progress_numeroRutina: any, IDUSUARIO: number, progress_seconds: string, progress_percentage: number, progress_show: boolean): Promise<number>{
    try {
      const data = {
        IDPROGRESOUSUARIO: parseInt(IDPROGRESOUSUARIO),
        IDEJERCICIO: parseInt(IDEJERCICIO),
        IDRUTINA: parseInt(IDRUTINA),
        IDSESION: parseInt(IDSESION),
        IDUSUARIO: IDUSUARIO,
        progress_seconds: progress_seconds,
        progress_percentage: progress_percentage,
        progress_show: progress_show,
        progress_numeroEjercicio: parseInt(progress_numeroEjercicio),
        progress_numeroRutina: parseInt(progress_numeroRutina)
      }
      const response = await this.apiService.createDataProgresoUsuario(data).toPromise();
      return response.IDPROGRESOUSUARIO;
    } catch (error) {
      this.presentCustomToast("Sin Registro", "danger");
      throw error;
    }
  }
}
