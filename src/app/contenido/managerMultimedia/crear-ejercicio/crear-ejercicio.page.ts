import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IP_ADDRESS } from '../../../constantes';
import { NavController, ToastController } from '@ionic/angular';
import { StatusBar } from '@capacitor/status-bar';
import { Storage } from '@ionic/storage-angular';
import { ApiServiceService } from '../../../api-service.service';

@Component({
  selector: 'app-crear-ejercicio',
  templateUrl: './crear-ejercicio.page.html',
  styleUrls: ['./crear-ejercicio.page.scss'],
})
export class CrearEjercicioPage implements OnInit {
  popoverConfig = {
    cssClass: 'custom-popover'
  };
  public loading = true;
  public ip_address = IP_ADDRESS;
  variable: any;
  selectedMultimedia?:number;
  searchTermMultimedia?: string;
  public dataMultimedia!: any[];
  constructor(private route: ActivatedRoute,
    private navController: NavController,
    public toastController: ToastController,
    private storage: Storage,
    private apiService: ApiServiceService) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.variable = params['variable'];
      console.log(this.variable); // Aquí deberías ver el valor pasado
    });
    this.test();
    //this.validateSesion();

  }
  ionViewDidEnter() {
    this.test();
    //this.validateSesion();
  }

  go_page(name: string){
    this.navController.navigateForward('/'+name);
  }
  StatusBar(){
    StatusBar.hide();
    StatusBar.setOverlaysWebView({ overlay: true });
    StatusBar.setBackgroundColor({ color: '#ffffff' });
  }
  test(){
    this.StatusBar();
    this.loading = false;
    this.obtenerMultimedia();
    console.log(this.dataMultimedia);
  }
  validateSesion(){
    try{
      this.storage.get('sesion').then((sesion) => {
        if (sesion && JSON.parse(sesion).rolUsuario == 99) {
          this.apiService.protectedRequestWithToken(JSON.parse(sesion).token).subscribe(
            (response) => {
              this.obtenerMultimedia();
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
    this.navController.navigateForward('/errorvideos');
    this.storage.remove('sesion');
  }
  public onInputChange(event: any) {

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

  obtenerMultimedia(){
    this.apiService.getMultimedia().subscribe(
      (response) => {
        this.dataMultimedia=response;
      },
      (error) => {
        this.presentCustomToast(error.error.error,"danger");
      }
    );
  }
}
