import { Component, OnInit } from '@angular/core';
import { StatusBar } from '@capacitor/status-bar';
import { NavController, ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { IP_ADDRESS } from '../../../constantes';
import { ApiServiceService } from 'src/app/api-service.service';

@Component({
  selector: 'app-informe-usuario',
  templateUrl: './informe-usuario.page.html',
  styleUrls: ['./informe-usuario.page.scss'],
})
export class InformeUsuarioPage implements OnInit {
  public ip_address = IP_ADDRESS;

  public loading = true;
  public userSesion!:string;
  public userSesionPerfil!:any;

  currentDate!: string;

  constructor(private navController: NavController,
    private storage: Storage,
    private apiService: ApiServiceService,
    public toastController: ToastController,) { }

  ngOnInit() {
    this.inicializedPage();
  }
  ionViewDidEnter() {
    this.inicializedPage();
  }

  inicializedPage(){
    this.updateCurrentDate();
    this.validateSesion();
    document.documentElement.style.setProperty('--background-informe','url('+IP_ADDRESS+'/media/images/background_informe.jpg)');
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
              this.chanceColorFooter();
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

  StatusBar(){
    StatusBar.hide();
    StatusBar.setOverlaysWebView({ overlay: true });
    StatusBar.setBackgroundColor({ color: '#ffffff' });
  }

  private handleError() {
    this.loading = false;
    this.navController.navigateForward('/error-users');
    this.storage.remove('sesion');
  }

  private chanceColorFooter(){
    document.documentElement.style.setProperty('--activate-foot10',' transparent');
    document.documentElement.style.setProperty('--activate-foot11',' #ffffffab');
    document.documentElement.style.setProperty('--activate-foot12',' transparent');
    document.documentElement.style.setProperty('--activate-foot20',' transparent');
    document.documentElement.style.setProperty('--activate-foot21',' #ffffffab');
    document.documentElement.style.setProperty('--activate-foot22',' transparent');
    document.documentElement.style.setProperty('--activate-foot30',' #ffffff');
    document.documentElement.style.setProperty('--activate-foot31',' #ffffff');
    document.documentElement.style.setProperty('--activate-foot32',' #ffffff6b');
    document.documentElement.style.setProperty('--activate-foot40',' transparent');
    document.documentElement.style.setProperty('--activate-foot41',' #ffffffab');
    document.documentElement.style.setProperty('--activate-foot42',' transparent');
    document.documentElement.style.setProperty('--activate-foot50',' transparent');
    document.documentElement.style.setProperty('--activate-foot51',' #ffffffab');
    document.documentElement.style.setProperty('--activate-foot52',' transparent');
  }

  convertirAMinusculas(texto: string): string {
    return texto.toLowerCase();
  }
  obtenerPrimerNombre(nombre:string): string {
    return nombre.split(' ')[0];
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
