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

  currentDate!: string;
  constructor(private storage: Storage,
    private apiService: ApiServiceService,
    public toastController: ToastController,
    private navController: NavController) { }

  ngOnInit() {
    this.chanceColorFooter();
    this.validateSesion();
    //this.test();
    this.cargarImagenesBefore();
    this.updateCurrentDate();
  }
  ionViewDidEnter() {
    //this.test();
    this.chanceColorFooter();
    this.validateSesion();
    this.cargarImagenesBefore();
    this.updateCurrentDate();
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
    let imagesLoaded = 0;
    const image1 = new Image();
    const image2 = new Image();
    image1.src = IP_ADDRESS + '/media/images/control-sesiones-1.png';
    image2.src = IP_ADDRESS + '/media/images/control-sesiones-2.png';

    const handleImageLoad = () => {
      imagesLoaded++;
      if (imagesLoaded === 2) {
        this.loading = false;
      }
    };

    image1.onload = handleImageLoad;
    image2.onload = handleImageLoad;
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
        if (sesion && JSON.parse(sesion).rolUsuario == 99) {
          this.userSesion = JSON.parse(sesion).nickname;
          this.obtenerGetPerfilCompleto(this.userSesion);
          this.apiService.protectedRequestWithToken(JSON.parse(sesion).token).subscribe(
            (response) => {
              this.StatusBar();
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
