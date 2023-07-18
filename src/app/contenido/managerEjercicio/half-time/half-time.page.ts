import { Component, OnInit } from '@angular/core';
import { IP_ADDRESS } from '../../../constantes';
import { StatusBar } from '@capacitor/status-bar';
import { Storage } from '@ionic/storage-angular';
import { ApiServiceService } from '../../../api-service.service';
import { NavController,ToastController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-half-time',
  templateUrl: './half-time.page.html',
  styleUrls: ['./half-time.page.scss'],
})
export class HalfTimePage implements OnInit {
  public ip_address = IP_ADDRESS;
  public userSesion!:string;
  public userSesionPerfil!:any;

  variableVideosEjercicio!:any;
  variable!:any;
  variableEjercicios!:any[];
  variableEjerciciositem!:number;
  variableRutinaDiaria!:any;
  variableprogramarrutinas!:any;
  variableParamentro!:any;
  previusPagelistarGuardados!:any;
  previusPageMain!:any;
  variableSesiones!:any;

  previusPagelistarRutinasAll!:any;
  previusPagelistarSesionesRutinasAll!:any;
  previusPagelistarEjercicioAll!:any;

  IDPROGRESOUSUARIO!:any;

  cronometro!: string;
  segundos: number = 30;

  public dataEjercicio!: any[];

  public loading = true;
  constructor(
    private route: ActivatedRoute,
    private navController: NavController,
    private apiService: ApiServiceService,
    private storage: Storage,
    public toastController: ToastController
  ) {
    this.actualizarCronometro();
  }
  ngOnInit() {
    this.segundos = 30;
    this.recuperarDatos();
    this.validateSesion();
    //this.test();
  }
  ionViewDidEnter() {
    this.segundos = 30;
    this.recuperarDatos();
    this.validateSesion();
    //this.test();
  }
  test(){
    this.loading=false;
  }

  StatusBar(){
    StatusBar.hide();
    StatusBar.setOverlaysWebView({ overlay: true });
    StatusBar.setBackgroundColor({ color: '#ffffff' });
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
      this.IDPROGRESOUSUARIO= params['IDPROGRESOUSUARIO'] as any || null;
    });
  }
  async validateSesion() {
    try {
      const sesion = await this.storage.get('sesion');
      if (sesion && JSON.parse(sesion).rolUsuario == 1) {
        this.userSesion = JSON.parse(sesion).nickname;
        this.obtenerGetPerfilCompleto(this.userSesion);
        const response = await this.apiService.protectedRequestWithToken(JSON.parse(sesion).token).toPromise();
        this.StatusBar();
        this.obtenerEjercicios();
        this.loading=false;
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


  obtenerPrimerNombre(nombreCompleto: string): string {
    if (nombreCompleto) {
      const nombres = nombreCompleto.split(" ");
      return nombres[0];
    }
    return '';
  }


  go_page(name:string){
    this.navController.navigateForward('/' + name, {
      queryParams: {
        variableEjercicio: this.variable,
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
        IDPROGRESOUSUARIO: this.IDPROGRESOUSUARIO,
      }
    });
  }

  nextEjercicio() {
    this.variableEjerciciositem ++;
    const elementoEncontrado = this.dataEjercicio.find(item => item.IDEJERCICIO === this.variableEjercicios[this.variableEjerciciositem]);
    this.navController.navigateRoot('/video-uniq', {
      queryParams: {
        variableVideosEjercicio:elementoEncontrado,
        variableEjercicio: elementoEncontrado,
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
        IDPROGRESOUSUARIO: this.IDPROGRESOUSUARIO,
      },
    });
  }


  private actualizarCronometro() {
    const minutos = Math.floor(this.segundos / 60);
    const segundosRestantes = this.segundos % 60;

    const minutosTexto = minutos < 10 ? '0' + minutos : minutos;
    const segundosTexto = segundosRestantes < 10 ? '0' + segundosRestantes : segundosRestantes;

    this.cronometro = minutosTexto + ':' + segundosTexto;

    if (this.segundos > 0) {
      setTimeout(() => {
        this.segundos--;
        this.actualizarCronometro();
      }, 1000);
    } else {
      this.nextEjercicio();
    }
  }
  agregarTiempo() {
    this.segundos += 20;
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

}
