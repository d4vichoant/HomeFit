import { Component, OnInit } from '@angular/core';
import { StatusBar } from '@capacitor/status-bar';
import { NavController, ToastController } from '@ionic/angular';

import { IP_ADDRESS } from '../../../constantes';
import { ApiServiceService } from '../../../api-service.service';

// Definición del tipo DatoTipo
interface DatoTipo {
  // Propiedades y tipos correspondientes
  idESPECIALIDADENTRENADOR: number;
  tituloESPECIALIDADENTRENADOR: string;
  descripcionESPECIALIDADENTRENADOR: string;
  imagenESPECIALIDADENTRENADOR: string;
  // ... otras propiedades
}
@Component({
  selector: 'app-specialty',
  templateUrl: './specialty.page.html',
  styleUrls: ['./specialty.page.scss'],
})
export class SpecialtyPage implements OnInit {
  public loading = true;
  datos: any[] = []; // Array para almacenar los datos
  public ip_address = IP_ADDRESS;
  selectedItems: DatoTipo[] = [];
  constructor(private navController: NavController,
    private apiService: ApiServiceService,
    public toastController: ToastController) { }

  ngOnInit() {

  }

  goHome(){
    this.navController.navigateForward('/home');
  }
  public goBack(){
    this.navController.navigateForward(['/brithday']);
  }


  ionViewDidEnter() {
    StatusBar.hide();
    StatusBar.setOverlaysWebView({overlay:true});
    StatusBar.setBackgroundColor({color:'#ffffff'});
    if (JSON.parse(localStorage.getItem('profilesdates')!)!=null){
    this.apiService.allEspecialidadentrenador().subscribe(
      (data:DatoTipo[]) => {
        this.datos = data.map((dass:DatoTipo)=>{
          return{
            dass,
            isSelected: false
          };
        });

        const imagesToLoad = this.datos.length;
        let imagesLoaded = 0;

        const handleImageLoad = () => {
          imagesLoaded++;
          if (imagesLoaded === imagesToLoad) {
            this.loading = false;
          }
        };
        // Carga dinámica de las imágenes desde la base de datos
        this.datos.forEach((dato) => {
          const image = new Image();
          image.src = IP_ADDRESS + '/media/specialty/' + dato.dass.imagenESPECIALIDADENTRENADOR;
          console.log(image.src);
          image.onload = handleImageLoad;
        });
      },
      (error) => {
        console.error(error); // Muestra el error en la consola en caso de que ocurra
      }
    );

    document.documentElement.style.setProperty('--background-ip-address','url('+IP_ADDRESS+'/media/genders/background-genders.jpg)');
    }else{
      localStorage.removeItem('profilesdates');
      this.navController.navigateForward('/errorpage');
    }
  }
  prefer_noAnswer(){
    this.go_nextPage();
  }
  go_nextPage(){
    this.selectedItems.splice(0, this.selectedItems.length);
    let ind = false;
    for (let i = 0; i < this.datos.length; i++) {
      if(this.datos[i].isSelected==true){
        this.selectedItems.push(this.datos[i].dass);
        ind = true;
      }
    }
    var profiledat = JSON.parse(localStorage.getItem('profilesdates')!);
    profiledat.specialty = this.selectedItems;
    localStorage.setItem('profilesdates', JSON.stringify(profiledat));
    if (ind){
      this.navController.navigateForward(['/additional']);
    }else{
      this.presentCustomToast("Debe seleccionar al menos 1","danger");
    }

  }
  checkboxChanged(dato: any) {
    for (let i = 0; i < this.datos.length; i++) {
      if(this.datos[i].dass.idespecialidadentrenador==dato.dass.idespecialidadentrenador){
        this.datos[i].isSelected=!this.datos[i].isSelected;
        break;
      }
    }
    dato.dass.isSelected = !dato.dass.isSelected;
  }

  async presentCustomToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 1400,
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
}

