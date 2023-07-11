import { Component, OnInit,ViewChild  } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiServiceService } from '../../../api-service.service';
import { StatusBar } from '@capacitor/status-bar';
import { NavController, ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { IP_ADDRESS } from '../../../constantes';
import { AlertController } from '@ionic/angular';
import { IonInfiniteScroll } from '@ionic/angular';
import * as moment from 'moment';

@Component({
  selector: 'app-data-entrenador',
  templateUrl: './data-entrenador.page.html',
  styleUrls: ['./data-entrenador.page.scss'],
})
export class DataEntrenadorPage implements OnInit {

  @ViewChild(IonInfiniteScroll) infiniteScroll?: IonInfiniteScroll;

  public ip_address = IP_ADDRESS;
  public userSesion!:string;
  public userSesionPerfil!:any;
  public loading = true;
  variable: any; // Ajustar el tipo a un solo entrenador en lugar de any[]
  public statuscarpeta:boolean=true;
  validatorCargarDatos:boolean=false;
  //public data!: any[];

  public dataRutinas!: any[];
  public dataSesiones!:any[];
  public datacomentariosentrenador!:any[];
  datacomentariosentrenadorparcial!:any[];
  OPINIONCOMENTARIOENTRENADOR!:string;
  showmodalstars:boolean=false;
  evaluateComment:number=0;
  validatebuttonEvaluate:boolean=false;
  showovelaysusciption:boolean=false;

  public suscripciones!:any[];
  selectSuscripcion:number=-1;
  suscripcionStatus:boolean=false;

  pagarTotal!:string;

  constructor(private navController: NavController,
    private apiService: ApiServiceService,
    private storage: Storage,
    public toastController: ToastController,
    public alertController: AlertController,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    if(!this.validatorCargarDatos){
      this.recuperarDatos();
    }
    this.validateSesion();
    //this.test();

  }
  ionViewDidEnter() {
    if(!this.validatorCargarDatos){
      this.recuperarDatos();
    }
    this.validateSesion();
    //this.test();
  }
  recuperarDatos(){
    this.validatorCargarDatos=true;
    try {
      this.route.queryParams.subscribe(params => {
        this.variable = params['variableEntrenador'];
        if(this.variable.tituloESPECIALIDADENTRENADOR)
        {
          const tituloESPECIALIDADENTRENADORarray=this.variable.tituloESPECIALIDADENTRENADOR.split(",");
          this.variable.tituloESPECIALIDADENTRENADOR=tituloESPECIALIDADENTRENADORarray;
        }
        if(this.variable.CERTIFICACIONESENTRENADOR){
          const dataArray: any[] = JSON.parse(this.variable.CERTIFICACIONESENTRENADOR);
          this.variable.CERTIFICACIONESENTRENADOR=dataArray;
        }
      });
    } catch (error) {
      this.handleError();
    }
  }
  test(){
    this.chanceColorFooter();
    this.StatusBar();
    this.obtenercomentariosentrenador();
    this.obtenerRutinas();
    this.obtenerSesiones();
    this.llenarSuscripcion();
    this.actualizarNumero();
    this.obtenerContratoUsuario();
    //this.obtenerEntrenadores();
    this.loading = false;
  }
  StatusBar(){
    StatusBar.hide();
    StatusBar.setOverlaysWebView({ overlay: true });
    StatusBar.setBackgroundColor({ color: '#ffffff' });
  }

  validateSesion(){
    try{
      this.storage.get('sesion').then((sesion) => {
        if (sesion && JSON.parse(sesion).rolUsuario == 1) {
          this.userSesion = JSON.parse(sesion).nickname;
          this.obtenerGetPerfilCompleto(this.userSesion);
          this.apiService.protectedRequestWithToken(JSON.parse(sesion).token).subscribe(
            (response) => {
              this.chanceColorFooter();
              this.StatusBar();
              this.obtenercomentariosentrenador();
              this.obtenerRutinas();
              this.obtenerSesiones();
              this.llenarSuscripcion();
              this.actualizarNumero();
              this.obtenerContratoUsuario();
              this.loading = false;
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

  private chanceColorFooter(){
    document.documentElement.style.setProperty('--activate-foot10',' transparent');
    document.documentElement.style.setProperty('--activate-foot11',' #6b6a6b');
    document.documentElement.style.setProperty('--activate-foot20',' transparent');
    document.documentElement.style.setProperty('--activate-foot21',' #6b6a6b');
    document.documentElement.style.setProperty('--activate-foot30',' #9259f9');
    document.documentElement.style.setProperty('--activate-foot31',' #9259f9');
    document.documentElement.style.setProperty('--activate-foot40',' transparent');
    document.documentElement.style.setProperty('--activate-foot41',' #6b6a6b');
  }

  go_page(name: string){
    this.validatorCargarDatos=false;
    this.variable=null;
    this.statuscarpeta=true;
    this.OPINIONCOMENTARIOENTRENADOR='';
    this.evaluateComment=0;
    this.pagarTotal='';
    this.selectSuscripcion=-1;
    this.navController.navigateForward('/'+name);
  }
  obtenerPrimerNombre(nombre: string): string {
    if (nombre && typeof nombre === 'string') {
      const nombreArray = nombre.split(' ');
      if (nombreArray.length > 0) {
        return nombreArray[0];
      }
    }
    return ''; // Valor predeterminado en caso de que el nombre no sea válido
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
    const sesion = this.dataSesiones;
    if (Array.isArray(sesion)) {
      for (let i = 0; i < sesion.length; i++) {
        const nameImagen = sesion[i].IMAGESESION;
        const imageUrl = this.ip_address+'/media/sesiones/portadassesiones/'+nameImagen;
        imageUrls.push(imageUrl);
      }
    }
    const imgRutinas = this.datacomentariosentrenadorparcial;
    if (Array.isArray(imgRutinas)) {
      for (let i = 0; i < imgRutinas.length; i++) {
        const nameImagen = imgRutinas[i].IMAGEPERSONA;
        const imageUrl = this.ip_address+'/media/perfile/'+nameImagen;
        imageUrls.push(imageUrl);
      }
    }

    const imageUrl = this.ip_address+'/media/perfile/'+this.variable.IMAGEPERSONA;
    imageUrls.push(imageUrl);
    const imageUrl1 = this.ip_address+'/media/images/suscripcion.png';
    imageUrls.push(imageUrl1);
    let imagesLoaded = 0;
    const totalImages = imageUrls.length;
    const handleImageLoad = () => {
      imagesLoaded++;
      if (imagesLoaded === totalImages) {
        setTimeout(() => {
          this.loading = false;
        }, 1000);
      }
    };
    imageUrls.forEach((imageUrl) => {
      const image = new Image();
      image.onload = handleImageLoad;
      image.src = imageUrl;
    });
  }

  calcularTiempoPasado(fecha: string): string {
    const fechaActual = moment();
    const fechaDada = moment(fecha);
    const diferencia = fechaActual.diff(fechaDada, 'minutes');

    if (diferencia < 60) {
      return `${diferencia} min`;
    } else if (diferencia < 1440) {
      const horas = Math.floor(diferencia / 60);
      return `${horas} horas`;
    } else {
      const dias = Math.floor(diferencia / 1440);
      return `${dias} días`;
    }
  }

  llenarSuscripcion(){
      this.suscripciones = [
      {
        titulo: 'Suscripción',
        subtitulo: 'Básica',
        precio: '',
        imagen: this.ip_address+'/media/tariff/icon1.png',
        detalles: '1 mes',
        colorbackground:'#f6f3ff',
      },
      {
        titulo: 'Suscripción',
        subtitulo: 'Premium',
        precio: '',
        imagen: this.ip_address+'/media/tariff/icon2.png',
        detalles: '3 meses',
        colorbackground:'#f1edfe',
      },
      {
        titulo: 'Suscripción',
        subtitulo: 'Pro',
        precio: '',
        imagen: this.ip_address+'/media/tariff/icon3.png',
        detalles: '6 meses',
        colorbackground:'#f1edfe',
      },
      {
        titulo: 'Suscripción',
        subtitulo: 'Golden',
        precio: '',
        imagen: this.ip_address+'/media/tariff/icon4.png',
        detalles: '12 meses',
        colorbackground:'#f6f3ff',
      },
    ];
  }

  animateFromBottom() {
    const element = document.getElementById('element');
    element?.classList.remove('hidden');
    element?.classList.add('visible');
    const element2 = document.getElementById('element2');
    element2?.classList.remove('hidden');
    element2?.classList.add('visible');
  }
  animateFromTop() {
    const element = document.getElementById('element');
    element?.classList.remove('visible');
    element?.classList.add('hidden');
    const element2 = document.getElementById('element2');
    element2?.classList.remove('visible');
    element2?.classList.add('hidden');
  }

  changeStart(number:number){
    this.evaluateComment=number;
    if(!this.validatebuttonEvaluate){
      this.validatebuttonEvaluate=true;
    }
  }
  changeSuscripcion(item:number,data:any){
    this.selectSuscripcion=item;
    this.pagarTotal=data.precio;
  }
  truncateText(text: string): string {
    const wordArray = text.trim().split(' ');
    const truncatedArray = wordArray.slice(0, 10);
    return truncatedArray.join(' ');
  }

  getRemainingText(text: string): string {
    const wordArray = text.trim().split(' ');
    const remainingArray = wordArray.slice(10);
    return remainingArray.join(' ');
  }

  contarpalabras(texto: string): number {
    const palabras = texto.trim().split(' ');
    return palabras.length;
  }
  confirmarinsertarcomentarioentrenador(){
    this.showmodalstars=true;
  }
  clearcomentarioentrenador(){
    this.showmodalstars=false;
    this.evaluateComment=0;
    this.validatebuttonEvaluate=false;
  }
  actualizarNumero() {
    this.variable.TARIFASENTRENADOR = parseFloat(this.variable.TARIFASENTRENADOR).toFixed(2)+"";
    this.suscripciones[0].precio = '$ ' + this.variable.TARIFASENTRENADOR + ' USD';
    this.suscripciones[1].precio = '$ ' + (parseFloat(this.variable.TARIFASENTRENADOR)*3 - (parseFloat(this.variable.TARIFASENTRENADOR)*3) * (17 / 100)).toFixed(2) + ' USD';
    this.suscripciones[2].precio = '$ ' + (parseFloat(this.variable.TARIFASENTRENADOR)*6 - (parseFloat(this.variable.TARIFASENTRENADOR)*6) * (25 / 100)).toFixed(2) + ' USD';
    this.suscripciones[3].precio = '$ ' + (parseFloat(this.variable.TARIFASENTRENADOR)*12 - (parseFloat(this.variable.TARIFASENTRENADOR)*12) * (33 / 100)).toFixed(2) + ' USD';
  }
  significadoselectSuscripcion(selectSuscripcion:number):number{
    switch (selectSuscripcion) {
      case 0:
        return 1;
      case 1:
        return 3;
      case 2:
        return 6;
      case 3:
        return 12;
      default:
        return -1;
    }
  }
  contratacionNoDisponible(){
    this.presentCustomToast('Selecciona un Plan','danger');
  }
  async presentCustomToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 3400,
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

  contratacionEntrenador(){
    this.apiService.ContratoEntrenador(this.userSesionPerfil[0].IDUSUARIO,this.variable.IDENTRENADOR,this.significadoselectSuscripcion(this.selectSuscripcion)).subscribe(
      (response) => {
        this.presentCustomToast(response.message,"success");
        this.pagarTotal='';
        this.selectSuscripcion=-1;
        this.animateFromTop();
        this.obtenerContratoUsuario();
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
        this.dataRutinas = this.dataRutinas.filter(element => element.IDENTRENADOR === this.variable.IDPERSONA);
        this.dataRutinas = this.dataRutinas.map(objeto => ({
          ...objeto,
          IDEJERCICIOS: objeto.IDEJERCICIOS.split(",").map(Number)
        }));
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
        this.dataSesiones = this.dataSesiones.filter(element => element.IDENTRENADOR === this.variable.IDPERSONA);
        this.dataSesiones = this.dataSesiones.map(objeto => ({
          ...objeto,
          IDRUTINAS: objeto.IDRUTINAS.split(",").map(Number)
        }));
      },
      (error) => {
        this.presentCustomToast(error.error.error,"danger");
      }
    );
  }
  obtenercomentariosentrenador(){
    this.apiService.getcomentariosentrenador(this.variable.IDENTRENADOR).subscribe(
      (response) => {
        this.datacomentariosentrenador=response;
        this.datacomentariosentrenadorparcial=this.datacomentariosentrenador;
        this.datacomentariosentrenadorparcial = Object.values(this.datacomentariosentrenadorparcial.reduce((uniqueData: any, currentItem: any) => {
          if (!uniqueData[currentItem.IDUSUARIO]) {
            uniqueData[currentItem.IDUSUARIO] = currentItem;
          }
          return uniqueData;
        }, {}));
      },
      (error) => {
        this.presentCustomToast(error.error,"danger");
      }
    );
  }
  obtenerContratoUsuario(){
    this.apiService.obtenerContratoUsuario(this.userSesionPerfil[0].IDUSUARIO,this.variable.IDENTRENADOR).subscribe(
      (response) => {
        this.suscripcionStatus=response.active;
        this.cargarImagenesBefores();
      },
      (error) => {
        this.presentCustomToast(error.error,"danger");
      }
    );
  }
  insertarcomentarioentrenador(){
    if(this.OPINIONCOMENTARIOENTRENADOR===undefined|| this.OPINIONCOMENTARIOENTRENADOR===null){
      this.OPINIONCOMENTARIOENTRENADOR='';
    }
    this.apiService.insertarcomentarioentrenador(this.userSesionPerfil[0].IDUSUARIO,this.variable.IDENTRENADOR,this.evaluateComment-2,this.OPINIONCOMENTARIOENTRENADOR).subscribe(
      (response) => {
        this.presentCustomToast(response.message,"success");
        this.OPINIONCOMENTARIOENTRENADOR='';
        this.evaluateComment=0;
        this.showmodalstars=false;
        this.obtenercomentariosentrenador();
      },
      (error) => {
        this.presentCustomToast(error.error,"danger");
      }
    );
  }
}
