import { Component, OnDestroy, OnInit } from '@angular/core';
import { IP_ADDRESS } from '../../../constantes';
import { StatusBar } from '@capacitor/status-bar';
import { Storage } from '@ionic/storage-angular';
import { ApiServiceService } from '../../../api-service.service';
import { NavController,ToastController, ViewDidEnter } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-half-time',
  templateUrl: './half-time.page.html',
  styleUrls: ['./half-time.page.scss'],
})
export class HalfTimePage implements OnInit,OnDestroy,ViewDidEnter {
  public ip_address = IP_ADDRESS;
  public userSesion!:string;
  public userSesionPerfil!:any;

  variable!:any;
  //variableVideosEjercicio!:any;

  variableParamentro!:any;
  variableSesiones!:any;
  variableRutinaDiaria!:any;
  variableprogramarrutinas!:any;

  previusPageMain:boolean=false;
  previusPagelistarGuardados:boolean=false;
  previusPagelistarRutinasAll:boolean=false;
  previusPagelistarSesionesRutinasAll:boolean=false;
  previusPagelistarEjercicioAll:boolean=false;


  variableEjerciciositem!:number;
  variableEjercicios:any;

  variableRutinasitem:number=-1;
  variableRutinas:any;

  IDPROGRESOUSUARIO:number=-1;

  cronometro!: string;
  segundos: number = 30;

  public dataEjercicio!: any[];
  public dataRutinas!: any[];

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
    this.initializePage();
  }
  ionViewDidEnter() {
    this.initializePage();
  }
  initializePage(){
    this.inicio();
    this.segundos = 30;
    this.recuperarDatos();
    this.validateSesion();
  }

  ngOnDestroy() {
    this.inicio();
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
      //this.variableVideosEjercicio = params['variableVideosEjercicio'] as any || null;

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

      this.variableEjerciciositem = params['variableEjerciciositem'] as number || -1;
      this.variableEjercicios = params['variableEjercicios'] as any ||null;

      this.variableRutinasitem = params['variableRutinasitem'] as number || -1;
      this.variableRutinas = params['variableRutinas'] as any ||null;

      this.IDPROGRESOUSUARIO= params['IDPROGRESOUSUARIO'] as number || -1;

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
    this.segundos = 30;
    this.navController.navigateForward('/' + name, {
      queryParams: {
        variableEjercicio: this.variable,
        //variableVideosEjercicio:this.variableVideosEjercicio,

        variableParametro:this.variableParamentro,
        variableRutinaDiaria :this.variableRutinaDiaria,
        variableprogramarrutinas:this.variableprogramarrutinas,
        variableSesiones: this.variableSesiones,

        previusPageMain:this.previusPageMain,
        previusPagelistarGuardados:this.previusPagelistarGuardados,
        previusPagelistarRutinasAll: this.previusPagelistarRutinasAll,
        previusPagelistarSesionesRutinasAll:this.previusPagelistarSesionesRutinasAll,
        previusPagelistarEjercicioAll:this.previusPagelistarEjercicioAll,

        variableEjercicios :this.variableEjercicios,
        variableEjerciciositem:this.variableEjerciciositem,

        variableRutinasitem:this.variableRutinasitem,
        variableRutinas:this.variableRutinas,

        IDPROGRESOUSUARIO: this.IDPROGRESOUSUARIO,
      }
    });
  }

  nextEjercicio() {
    this.segundos = 30;
    if (this.variableEjerciciositem === -1) {
      this.variableEjerciciositem = 0;
      this.variableEjerciciositem++;
    } else {
      this.variableEjerciciositem++;
    }
    if (this.variableEjerciciositem < this.variableEjercicios?.length) {
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
          previusPagelistarRutinasAll: this.previusPagelistarRutinasAll,
          previusPagelistarSesionesRutinasAll:this.previusPagelistarSesionesRutinasAll,
          previusPagelistarEjercicioAll:this.previusPagelistarEjercicioAll,

          variableEjercicios :this.variableEjercicios,
          variableEjerciciositem:this.variableEjerciciositem,

          variableRutinasitem:this.variableRutinasitem,
          variableRutinas:this.variableRutinas,

          IDPROGRESOUSUARIO: this.IDPROGRESOUSUARIO,
        },
      });
    }
  }

  async nextRutine(){
    this.segundos = 30;
    await this.obtenerRutinas();
    if(this.variableRutinas.length<=this.dataRutinas.length){
      if(this.variableRutinasitem===-1){
        this.variableRutinasitem=0;
      }
      this.variableRutinasitem++;
      this.variableEjerciciositem=0;
    }
    this.variableRutinaDiaria =  this.dataRutinas.find((elemento) => elemento.IDRUTINA === this.variableprogramarrutinas.IDRUTINAS[this.variableRutinasitem]);
    //this.variableEjerciciositem ++;
    const elementoEncontrado = this.dataEjercicio.find(item => item.IDEJERCICIO === this.variableRutinaDiaria.IDEJERCICIOS[this.variableEjerciciositem]);
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
  inicio(){

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
}
