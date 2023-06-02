import { Component, OnInit } from '@angular/core';
import { IP_ADDRESS } from '../../../constantes';
import { ApiServiceService } from '../../../api-service.service';
import { NavController, ToastController } from '@ionic/angular';
import { StatusBar } from '@capacitor/status-bar';
import { AlertController } from '@ionic/angular';

import { Storage } from '@ionic/storage-angular';
@Component({
  selector: 'app-videos',
  templateUrl: './videos.page.html',
  styleUrls: ['./videos.page.scss'],
})
export class VideosPage implements OnInit {
  public loading = true;
  public ip_address = IP_ADDRESS;
  public searchTerm!:string;
  private previousSearchTerm: string = '';

  public dataNivelDificultad!: any[] ;
  public dataEjercicio!:any[];
  public origindata!:any[];

  selectedItem: number = -1;
  constructor(private navController: NavController,
    private apiService: ApiServiceService,
    public toastController: ToastController,
    private storage: Storage,
    public alertController: AlertController) { }

  ngOnInit() {
    this.validateSesion();
    //this.test();

  }
  ionViewDidEnter() {
    //this.test();
    this.validateSesion();
  }

  StatusBar(){
    StatusBar.hide();
    StatusBar.setOverlaysWebView({ overlay: true });
    StatusBar.setBackgroundColor({ color: '#ffffff' });
  }
  test(){
    this.loading = false;
    this.obtenerNivelDificultad();
    this.obtenerEjercicios();
  }

  validateSesion(){
    try{
      this.storage.get('sesion').then((sesion) => {
        if (sesion && JSON.parse(sesion).rolUsuario == 99) {
          this.apiService.protectedRequestWithToken(JSON.parse(sesion).token).subscribe(
            (response) => {
              this.StatusBar();
              this.obtenerEjercicios();
              this.obtenerNivelDificultad();
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

  go_page(name: string){
    this.navController.navigateForward('/'+name);
  }
  go_page_create(name: string, data: any) {
    this.navController.navigateForward('/' + name, {
      queryParams: {
        variable: data
      }
    });
  }

  getVideoName(url: string): string {
    return url.split('.')[0];
  }
  async confirmaractualizarEjercicioActivacion(dataEjercicio :any) {
    const alert = await this.alertController.create({
      header: 'Confirmar Estado',
      message: '¿Estás seguro de activar/desactivar este '+name+'?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            this.presentCustomToast('Proceso cancelada',"danger");
          }
        }, {
          text: 'Aceptar',
          handler: () => {
            this.presentCustomToast('Estado del Ejercicicio cambiada correctamente',"success");
            this.actualizarEjercicioActivacion(dataEjercicio);
          }
        }
      ]
    });

    await alert.present();
  }
  actualizarEjercicioActivacion(dataEjercicio: any) {
    this.storage.get('sesion').then((sesionString) => {
      if (sesionString) {
        var profiledat = JSON.parse(sesionString);
        dataEjercicio.USUARIOMODIFICAICONEJERCICIO = profiledat.nickname;
        this.loading = true;
        dataEjercicio.ESTADOEJERCICIO=!dataEjercicio.ESTADOEJERCICIO;
        this.apiService.UpdateEjercicioEstado(dataEjercicio).subscribe(
          (response) => {
            this.presentCustomToast(response.message, "success");
            this.loading = true;
            this.ngOnInit();
            this.loading = false;
          },
          (error) => {
            this.presentCustomToast(error.error.error, "danger");
          }
        );
      } else {
        this.presentCustomToast('No se encontró la sesión', "danger");
      }
    });
  }
public onInputChange(event: any) {
  const currentSearchTerm = event.target.value;
  if (currentSearchTerm.length < this.previousSearchTerm.length) {
    this.dataEjercicio=this.origindata;
    this.selectedItem = -1;
  }
  this.previousSearchTerm = currentSearchTerm;
  this.filterItems();
}

async buttonfilterhabilitate(filter: any,index:number) {
  if (!this.origindata){
    const rawData = this.dataEjercicio;
    this.origindata = rawData.map(item => ({ ...item }));
  }else{
    this.dataEjercicio=this.origindata;
  }
  if(this.selectedItem === index){
    this.selectedItem = -1;
    this.dataEjercicio=this.origindata;
  }else{
    this.selectedItem = index;
    this.dataEjercicio = this.dataEjercicio.filter(item=>
      item.tituloniveldificultadejercicio.toLowerCase().includes(filter.tituloniveldificultadejercicio.toLowerCase()));
  }
  }
  private filterItems() {
    if (!this.origindata) {
      const rawData = this.dataEjercicio;
      this.origindata = rawData.map(item => ({ ...item }));
    }

    const searchTerms = this.searchTerm.toLowerCase().trim().split(' ');
    if (searchTerms.length >= 1) {
      let filteredArray: any[] = [];

      for (const term of searchTerms) {
        const filteredItems = this.dataEjercicio.filter(item =>
          item.titulotipoejercicio.toLowerCase().includes(term) ||
          item.tituloniveldificultadejercicio.toLowerCase().includes(term) ||
          item.NOMBREEJERCICIO.toLowerCase().includes(term)
        );

        filteredArray = filteredArray.concat(filteredItems);
      }

      // Eliminar duplicados del array filtrado
      this.dataEjercicio = Array.from(new Set(filteredArray));
    }
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
  obtenerNivelDificultad(){
    this.apiService.getNivelDificultaDejercicio().subscribe(
      (response) => {
        this.dataNivelDificultad=response;
      },
      (error) => {
        this.presentCustomToast(error.error.error,"danger");
      }
    );
  }
  obtenerEjercicios(){
    this.apiService.getPreEjercicio().subscribe(
      (response) => {
        this.dataEjercicio=response;
      },
      (error) => {
        this.presentCustomToast(error.error.error,"danger");
      }
    );
  }

}
