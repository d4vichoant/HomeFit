import { Component, ViewChild, ElementRef , OnInit } from '@angular/core';
import { IP_ADDRESS } from '../../../constantes';
import { StatusBar } from '@capacitor/status-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController, ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { ApiServiceService } from '../../../api-service.service';

@Component({
  selector: 'app-ejercicio-uniq',
  templateUrl: './ejercicio-uniq.page.html',
  styleUrls: ['./ejercicio-uniq.page.scss'],
})
export class EjercicioUniqPage implements OnInit {
  @ViewChild('videoPlayer') videoPlayer!: ElementRef;

  public userSesion!:string;
  public userSesionPerfil!:any;
  public loading = true;

  bookmarkState: { [key: number]: boolean } = {};
  dataBookMark!:any[];

  public dataEjercicio!: any[];

  public ip_address = IP_ADDRESS;
  statussound :boolean=true;
  statuslikeup :boolean=true;
  public isPlaying = true;
  statuslikedown :boolean=true;
  variable!:any;
  variableEjercicios!:any[];
  variableEjerciciositem!:number;
  variableRutinaDiaria!:any;
  variableprogramarrutinas!:any;
  variableParamentro!:any;
  previusPagelistarGuardados!:any;
  previusPageMain!:any;
  variableSesiones!:any;

  constructor(private route: ActivatedRoute,
    private apiService: ApiServiceService,
    private storage: Storage,
    private navController: NavController,
    public toastController: ToastController,
    private router: Router) { }

  ngOnInit() {
    try {
      this.recuperarDatos();
      this.validateSesion();
      //this.test();
    } catch (error) {
      this.handleError();
    }
  }
  ionViewDidEnter() {
    try {
      this.recuperarDatos();
      this.validateSesion();
      //this.test();
    } catch (error) {
      this.handleError();
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
  private handleError() {
    this.loading = false;
    this.navController.navigateForward('/error-page-users-trainers');
    this.storage.remove('sesion');
  }

  recuperarDatos(){
    this.route.queryParams.subscribe(params => {
      this.variable = params['variableEjercicio'] as any || null;
      this.variableParamentro = params['variableParametro'] as any || null;
      this.variableRutinaDiaria = params['variableRutinaDiaria'] as any || null;
      this.variableprogramarrutinas = params['variableprogramarrutinas'] as any || null;
      this.variableSesiones = params['variableSesiones'] as any || null;
      this.previusPageMain = params['previusPageMain'] as any || null;
      this.previusPagelistarGuardados = params['previusPagelistarGuardados'] as any || null;
      this.variableEjercicios = params['variableEjercicios'] as any ||null;
      this.variableEjerciciositem = params['variableEjerciciositem'] as number;
    });
  }
  handleButtonClick(): void {
    this.variable = '';
    if (this.variableRutinaDiaria) {
      this.go_page('rutinas-diarias');
    } else if (this.variableprogramarrutinas) {
      this.go_page('programarrutinas');
    } else if (this.variableParamentro) {
      this.go_page('listar-parametros');
    } else if (this.previusPageMain){
      this.go_page('main');
    }else{
      this.go_page('listar-guardados');
    }
  }
  nextEjercicio() {
    this.variableEjerciciositem ++;
    const elementoEncontrado = this.dataEjercicio.find(item => item.IDEJERCICIO === this.variableEjercicios[this.variableEjerciciositem]);
    this.router.navigate(['.'], {
      relativeTo: this.route,
      queryParams: {
        variableEjercicio: elementoEncontrado,
        variableParamentro: this.variableParamentro,
        variableEjercicios: this.variableEjercicios,
        variableEjerciciositem: this.variableEjerciciositem,
        variableRutinaDiaria: this.variableRutinaDiaria,
        variableprogramarrutinas: this.variableprogramarrutinas,
        variableSesiones: this.variableSesiones,
        previusPageMain: this.previusPageMain,
        previusPagelistarGuardados: this.previusPagelistarGuardados,
      },
    });
  }
  previusEjercicio() {
    this.variableEjerciciositem --;
    const elementoEncontrado = this.dataEjercicio.find(item => item.IDEJERCICIO === this.variableEjercicios[this.variableEjerciciositem]);
    this.router.navigate(['.'], {
      relativeTo: this.route,
      queryParams: {
        variableEjercicio: elementoEncontrado,
        variableParamentro: this.variableParamentro,
        variableEjercicios: this.variableEjercicios,
        variableEjerciciositem: this.variableEjerciciositem,
        variableRutinaDiaria: this.variableRutinaDiaria,
        variableprogramarrutinas: this.variableprogramarrutinas,
        variableSesiones: this.variableSesiones,
        previusPageMain: this.previusPageMain,
        previusPagelistarGuardados: this.previusPagelistarGuardados,
      },
    });
  }
  go_page(name: string){
    if(this.variableRutinaDiaria){
      this.navController.navigateForward('/' + name, {
        queryParams: {
          variableEjercicio: "",
          variableRutinaDiaria:this.variableRutinaDiaria,
          variableSesiones:this.variableSesiones,
          previusPageMain :this.previusPageMain,
          previusPagelistarGuardados:this.previusPagelistarGuardados,
          variableParametro:"",
          variableprogramarrutinas:"",
        }
      });
    }else if (this.variableParamentro){
      this.navController.navigateForward('/' + name, {
        queryParams: {
          variableEjercicio: "",
          variableRutinaDiaria:"",
          variableSesiones:"",
          previusPageMain :this.previusPageMain,
          previusPagelistarGuardados:this.previusPagelistarGuardados,
          variableParametro:this.variableParamentro,
          variableprogramarrutinas:"",
        }
      });
    }else if(this.variableprogramarrutinas){
      this.navController.navigateForward('/' + name, {
        queryParams: {
          variableEjercicio: "",
          variableRutinaDiaria:"",
          variableSesiones:this.variableSesiones,
          previusPageMain :this.previusPageMain,
          previusPagelistarGuardados:this.previusPagelistarGuardados,
          variableParametro:"",
          variableprogramarrutinas:this.variableprogramarrutinas,
        }
      });
    }else if(this.previusPageMain){
      this.navController.navigateForward('/' + name, {
        queryParams: {
          variableEjercicio: "",
          variableRutinaDiaria:"",
          variableSesiones:"",
          previusPageMain :this.previusPageMain,
          previusPagelistarGuardados:"",
          variableParametro:"",
          variableprogramarrutinas:"",
        }
      });
    }else if(this.previusPagelistarGuardados){
      this.navController.navigateForward('/' + name, {
        queryParams: {
          variableEjercicio: "",
          variableRutinaDiaria:"",
          variableSesiones:"",
          previusPageMain :"",
          previusPagelistarGuardados:this.previusPagelistarGuardados,
          variableParametro:"",
          variableprogramarrutinas:"",
        }
      });
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
  autoplayVideo(event: Event) {
    const video: HTMLVideoElement = this.videoPlayer.nativeElement;
    video.muted = true;
    if (this.isPlaying) {
      video.play();
    }
  }
  toggleBookmark(index: number): void {
    if (this.bookmarkState[index]) {
      this.bookmarkState[index] = false;
      this.updateBookMarkUser(index,this.bookmarkState[index]);
    } else {
      this.bookmarkState[index] = true;
      this.updateBookMarkUser(index,this.bookmarkState[index]);
    }
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
  chanstatussound(){
    this.statussound=!this.statussound;
  }
  StatusBar(){
    StatusBar.hide();
    StatusBar.setOverlaysWebView({ overlay: true });
    StatusBar.setBackgroundColor({ color: '#232123' });
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
        this.dataEjercicio.forEach((ejercicio) => {
        ejercicio.CALORIASEJERCICIO= (this.obtenerDuracionEnMinutos(ejercicio.TIEMPOMULTIMEDIA)/60*ejercicio.METEJERCICIO*Number(this.userSesionPerfil[0].PESOUSUARIO)).toFixed(2);
        });
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
}
