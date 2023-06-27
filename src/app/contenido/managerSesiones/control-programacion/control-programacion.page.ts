import { Component, OnInit } from '@angular/core';
import { IP_ADDRESS } from '../../../constantes';
import { ApiServiceService } from '../../../api-service.service';
import { Storage } from '@ionic/storage-angular';
import { NavController, ToastController } from '@ionic/angular';
import { StatusBar } from '@capacitor/status-bar';

@Component({
  selector: 'app-control-programacion',
  templateUrl: './control-programacion.page.html',
  styleUrls: ['./control-programacion.page.scss'],
})
export class ControlProgramacionPage implements OnInit {
  public ip_address = IP_ADDRESS;
  public loading = true;
  public userSesion!:string;
  public userSesionPerfil!:any;

  imagenEntrenadorRutina!:any[];
  imagenEntrenadorSesion!:any[];

  currentDate!: string;
  constructor(private storage: Storage,
    private apiService: ApiServiceService,
    public toastController: ToastController,
    private navController: NavController) { }

  ngOnInit() {
    this.chanceColorFooter();
    this.updateCurrentDate();
    this.validateSesion();
    //this.test();
    //this.cargarImagenesBefore();

  }
  ionViewDidEnter() {
    //this.test();
    this.updateCurrentDate();
    this.chanceColorFooter();
    this.validateSesion();
    //this.cargarImagenesBefore();

  }
  private chanceColorFooter(){
    document.documentElement.style.setProperty('--activate-foot10',' transparent');
    document.documentElement.style.setProperty('--activate-foot11',' #6b6a6b');
    document.documentElement.style.setProperty('--activate-foot20','transparent');
    document.documentElement.style.setProperty('--activate-foot21',' #6b6a6b');
    document.documentElement.style.setProperty('--activate-foot30',' #9259f9');
    document.documentElement.style.setProperty('--activate-foot31',' #9259f9');
    document.documentElement.style.setProperty('--activate-foot40',' transparent');
    document.documentElement.style.setProperty('--activate-foot41',' #6b6a6b');
  }
  cargarImagenesBefore(){
    const imageUrls = []; // Array para almacenar las URL de las imágenes
      if (Array.isArray(this.imagenEntrenadorRutina)) {
        for (let i = 0; i < this.imagenEntrenadorRutina.length; i++) {
          const videoName = this.imagenEntrenadorRutina[i].IMAGEPERSONA;
          const imageUrl = this.ip_address+'/media/perfile/'+videoName;
          imageUrls.push(imageUrl);
        }
      }
      if (Array.isArray(this.imagenEntrenadorSesion)) {
        for (let i = 0; i < this.imagenEntrenadorSesion.length; i++) {
          const videoName = this.imagenEntrenadorSesion[i].IMAGEPERSONA;
          const imageUrl = this.ip_address+'/media/perfile/'+videoName;
          imageUrls.push(imageUrl);
        }
      }
      //console.log(ejercicios);

      const imageUrlAdd = this.ip_address+ '/media/images/control-sesiones-1.png';
      imageUrls.push(imageUrlAdd);
      const imageUrlAdd1 = this.ip_address+'/media/images/control-sesiones-2.png';
      imageUrls.push(imageUrlAdd1);
      //console.log(imageUrls);
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
  test(){
    this.StatusBar();
  }
  StatusBar(){
    StatusBar.hide();
    StatusBar.setOverlaysWebView({ overlay: true });
    StatusBar.setBackgroundColor({ color: '#ffffff' });
  }
  validateSesion(){
    try{
      this.storage.get('sesion').then((sesion) => {
        if (sesion && JSON.parse(sesion).rolUsuario == 99 || JSON.parse(sesion).rolUsuario == 2) {
          this.userSesion = JSON.parse(sesion).nickname;
          this.obtenerGetPerfilCompleto(this.userSesion);
          this.apiService.protectedRequestWithToken(JSON.parse(sesion).token).subscribe(
            (response) => {
              this.StatusBar();
              this.obtenerImagenEntrenadorRutina();
              this.obtenerImagenEntrenadorSesion();
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
    this.navController.navigateForward('/error-sesiones');
    this.storage.remove('sesion');
  }

  go_page(name: string){
    //this.router.navigate(['/'+name], { state: { previousPage: 'crear-ejercicio' } });
    this.navController.navigateForward('/'+name);
  }
  updateCurrentDate() {
    const currentDate = new Date();
    const dayOfWeek = new Intl.DateTimeFormat('es-ES', { weekday: 'long' }).format(currentDate);
    const day = currentDate.getDate();
    const month = new Intl.DateTimeFormat('es-ES', { month: 'long' }).format(currentDate);
    this.currentDate = `${dayOfWeek}, ${day} de ${month}`;
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

    obtenerImagenEntrenadorRutina(){
      this.apiService.imagenEntrenadorRutina().subscribe(
        (response) => {
          this.imagenEntrenadorRutina=response;
          this.imagenEntrenadorRutina = this.imagenEntrenadorRutina.slice(0,4);
          //this.cargarImagenesBefore();
        },
        (error) => {
          this.presentCustomToast(error.error.error,"danger");
        }
      );
    }
    obtenerImagenEntrenadorSesion(){
      this.apiService.imagenEntrenadorSesion().subscribe(
        (response) => {
          this.imagenEntrenadorSesion=response;
          this.imagenEntrenadorSesion = this.imagenEntrenadorSesion.slice(0,4);
          this.cargarImagenesBefore();
        },
        (error) => {
          this.presentCustomToast(error.error.error,"danger");
        }
      );
    }
  obtenerGetPerfilCompleto(nickname:string){
    this.apiService.connsultPerfilCompleto(nickname).subscribe(
      (response) => {
        this.userSesionPerfil=response;
      },
      (error) => {
        this.presentCustomToast(error.error.error,"danger");
      }
    );
  }
}
