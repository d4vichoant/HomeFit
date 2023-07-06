import { Component, OnInit } from '@angular/core';
import { ApiServiceService } from '../../../api-service.service';
import { StatusBar } from '@capacitor/status-bar';
import { NavController, ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { IP_ADDRESS } from '../../../constantes';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-contrato-entrenador',
  templateUrl: './contrato-entrenador.page.html',
  styleUrls: ['./contrato-entrenador.page.scss'],
  providers: [DatePipe],
})
export class ContratoEntrenadorPage implements OnInit {
  public ip_address = IP_ADDRESS;
  public userSesion!:string;
  public userSesionPerfil!:any;
  public loading = true;
  public dataEntrenadores!: any[];
  public imgEntrenadores!: any[];

  constructor(private navController: NavController,
    private apiService: ApiServiceService,
    private storage: Storage,
    private datePipe: DatePipe,
    public toastController: ToastController) {
    }
  ngOnInit() {
    this.validateSesion();
    //this.test();
  }
  ionViewDidEnter() {
    this.validateSesion();
    //this.test();
  }
  test(){
    this.chanceColorFooter();
    this.StatusBar();
    this.obtenerEntrenadores();
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
              this.obtenerEntrenadores();
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

  hideDiv() {
    var div = document.querySelector('.fullscreen-bg');
    div?.classList.add('hide');
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
  cargarImagenesBefores(){
    const entrenadores = this.dataEntrenadores;
    const imageUrls = [];
    if (Array.isArray(entrenadores)) {
      for (let i = 0; i < entrenadores.length; i++) {
        const nameImagen = entrenadores[i].IMAGEPERSONA;
        const imageUrl = this.ip_address+'/media/perfile/'+nameImagen;
        imageUrls.push(imageUrl);
      }
    }
    const imageUrl = this.ip_address+'/media/perfile/background.png';
    imageUrls.push(imageUrl);
    const imageUrl1 = this.ip_address+'/media/perfile/portada.png';
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

  go_page_create(name: string, data: any) {
    this.navController.navigateForward('/' + name, {
      queryParams: {
        variableEntrenador: data
      }
    });
  }

  obtenerEntrenadores(){
    this.apiService.allTrainerBasicEjercicioRutina().subscribe(
      (response) => {
        this.dataEntrenadores=response;
        this.cargarImagenesBefores();
      },
      (error) => {
        this.presentCustomToast(error.error.error,"danger");
      }
    );
  }

  calcularEdad(fechaNacimiento: string): number {
    const fechaActual = new Date();
    const fechaNac = new Date(fechaNacimiento);
    let edad = fechaActual.getFullYear() - fechaNac.getFullYear();

    const mesActual = fechaActual.getMonth() + 1;
    const mesNac = fechaNac.getMonth() + 1;

    if (mesNac > mesActual || (mesNac === mesActual && fechaNac.getDate() > fechaActual.getDate())) {
      edad--;
    }

    return edad;
  }

  obtenerPrimerNombre(nombreCompleto: string): string {
    const nombres = nombreCompleto.split(" ");
    return nombres[0];
  }

}
