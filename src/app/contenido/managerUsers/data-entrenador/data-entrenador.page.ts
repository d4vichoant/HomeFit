import { Component, OnInit,ViewChild  } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiServiceService } from '../../../api-service.service';
import { StatusBar } from '@capacitor/status-bar';
import { NavController, ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { IP_ADDRESS } from '../../../constantes';
import { AlertController } from '@ionic/angular';
import { IonInfiniteScroll } from '@ionic/angular';


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
    //this.validateSesion();
    this.test();

  }
  ionViewDidEnter() {
    if(!this.validatorCargarDatos){
      this.recuperarDatos();
    }
    //this.validateSesion();
    this.test();
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

  loadMoreData(event: any) {
 /*    const lastItem = this.data[this.data.length - 1];
    const lastItemId = lastItem.id; // Obtén el ID del último elemento
    for (let i = 1; i <= 3; i++) {
      const newItem = { id: lastItemId + i, nombre: 'Elemento ' + (lastItemId + i) };
      this.data.push(newItem);
    } */
    this.infiniteScroll?.complete();
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
  async presentCustomToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2400,
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

  async confirmarcontratoEntrenador(variableEntrenador:any) {
    const alert = await this.alertController.create({
      header: 'Confirmar Contratación',
      message: '¿Estás seguro de contratar al entrenador seleccionado?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            this.presentCustomToast('Contratación cancelada',"danger");
          }
        }, {
          text: 'Aceptar',
          handler: () => {
            this.presentCustomToast('Contratación Exitosa',"success");
            this.contratacionEntrenador();
          }
        }
      ]
    });

    await alert.present();
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
    this.apiService.ContratoEntrenador(this.userSesionPerfil[0].IDUSUARIO,this.variable.IDENTRENADOR).subscribe(

      (response) => {
        this.presentCustomToast(response.message,"success");
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
        this.datacomentariosentrenadorparcial=this.datacomentariosentrenador.slice(0,3);
        console.log(this.datacomentariosentrenador);
      },
      (error) => {
        this.presentCustomToast(error.error,"danger");
      }
    );
  }
}
