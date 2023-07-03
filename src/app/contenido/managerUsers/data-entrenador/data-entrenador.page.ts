import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiServiceService } from '../../../api-service.service';
import { StatusBar } from '@capacitor/status-bar';
import { NavController, ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { IP_ADDRESS } from '../../../constantes';

@Component({
  selector: 'app-data-entrenador',
  templateUrl: './data-entrenador.page.html',
  styleUrls: ['./data-entrenador.page.scss'],
})
export class DataEntrenadorPage implements OnInit {

  public ip_address = IP_ADDRESS;
  public userSesion!:string;
  public userSesionPerfil!:any;
  public loading = true;
  variable: any; // Ajustar el tipo a un solo entrenador en lugar de any[]

  //public data!: any[];

  constructor(private navController: NavController,
    private apiService: ApiServiceService,
    private storage: Storage,
    public toastController: ToastController,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.variable = params['variableEntrenador'];
    });
    this.validateSesion();
  }

  ionViewDidEnter() {
    this.validateSesion();
    //this.test();
  }

  contratar(){

  }
  test(){
    this.chanceColorFooter();
    this.StatusBar();
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
    this.apiService.connsultPerfilCompleto(nickname).subscribe(
      (response) => {
        this.userSesionPerfil=response;
      },
      (error) => {
        this.presentCustomToast(error.error.error,"danger");
      }
    );
  }
  go_page(name: string){
    this.navController.navigateForward('/'+name);
  }
}

