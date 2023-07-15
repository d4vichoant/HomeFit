import { Component, OnInit } from '@angular/core';
import { IP_ADDRESS } from '../../../constantes';
import { Storage } from '@ionic/storage-angular';
import { ApiServiceService } from '../../../api-service.service';
import { ActivatedRoute } from '@angular/router';
import { NavController, ToastController } from '@ionic/angular';
import { StatusBar } from '@capacitor/status-bar';
import { ScreenOrientation,OrientationLockOptions } from '@capacitor/screen-orientation';



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
  public ip_address = IP_ADDRESS;

  showControls:boolean=true;
  showButtonPause:boolean=true;
  showButtonSound:boolean=true;
  mainProgress: number;
  videoElement!: HTMLVideoElement;

  timer: any;
  inactivityThreshold: number = 1500;

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiServiceService,
    private storage: Storage,
    private navController: NavController,
    public toastController: ToastController,
  ) {
    this.mainProgress = 0;
  }

  ngOnInit() {
    try {
      this.recuperarDatos();
      this.validateSesion();
      //this.test();
      window.addEventListener("orientationchange", this.onOrientationChange);
      ScreenOrientation.unlock()
      .then(() => {
        const lockOptions: OrientationLockOptions = {
          orientation: 'landscape',
        };
        ScreenOrientation.lock(lockOptions);
      })
      .catch((error) => {
        console.error('Error setting screen orientation', error);
      });
    } catch (error) {
      this.handleError();
    }
  }

  ngOnDestroy() {
    window.removeEventListener("orientationchange", this.onOrientationChange);
  }

  ionViewDidEnter() {
    try {
      this.recuperarDatos();
      this.validateSesion();
      //this.test();
      window.addEventListener("orientationchange", this.onOrientationChange);
      ScreenOrientation.unlock()
      .then(() => {
        const lockOptions: OrientationLockOptions = {
          orientation: 'landscape',
        };
        ScreenOrientation.lock(lockOptions);
      })
      .catch((error) => {
        console.error('Error setting screen orientation', error);
      });
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
    });
  }

  StatusBar(){
    StatusBar.hide();
    StatusBar.setOverlaysWebView({ overlay: true });
    StatusBar.setBackgroundColor({ color: '#232123' });
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
    const video = event.target as HTMLVideoElement;
    this.videoElement = video;

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
  }

  onAdditionalProgressClick(event: MouseEvent): void {
    if (this.videoElement) {
      const progressBar = document.querySelector('.progress-bar') as HTMLElement;
      const rect = progressBar.getBoundingClientRect();
      const clickX = event.clientX - rect.left;
      const progressWidth = progressBar.offsetWidth;
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
          this.showButtonPause=true;
        }
      }
      // Verificar si el usuario intenta saltar hacia atrás en el video
      else if (timeToSeek < this.videoElement.currentTime) {
        // Verificar si el tiempo de búsqueda está dentro de la duración total
        if (timeToSeek >= minSeekTime) {
          this.videoElement.currentTime = timeToSeek;
          this.videoElement.play(); // Reproducir el video
          this.showButtonPause=true;
        }
      }
    }
  }

  resetTimer(): void {
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      if(this.showControls){
        this.showControls=true;
      }
    }, this.inactivityThreshold);
  }

  startTimer(): void {
    clearTimeout(this.timer);
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
      default:
        console.log('Acción no reconocida');
    }
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
}
