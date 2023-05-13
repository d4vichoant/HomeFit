import { Component, OnInit } from '@angular/core';
import { StatusBar } from '@capacitor/status-bar';
import { NavController } from '@ionic/angular';

import { IP_ADDRESS } from '../constantes';
import { ApiServiceService } from '../api-service.service';

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
  constructor(private navController: NavController,
    private apiService: ApiServiceService) { }

  ngOnInit() {

  }

  goHome(){
    this.navController.navigateForward('/home');
  }
  public goBack(){
    this.navController.navigateForward(['/brithday'])
  }


  ionViewDidEnter() {
    StatusBar.hide();
    StatusBar.setOverlaysWebView({overlay:true});
    StatusBar.setBackgroundColor({color:'#ffffff'});

    this.apiService.allEspecialidadentrenador().subscribe(
      (data:DatoTipo[]) => {
        this.datos = data.map((dass:DatoTipo)=>{
          return{
            dass,
            isSelected: false
          };
        });

        console.log(this.datos);

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
  }
  prefer_noAnswer(){
    this.go_nextPage();
  }
  go_nextPage(){
    var profiledat = JSON.parse(localStorage.getItem('profilesdates')!);

    localStorage.setItem('profilesdates', JSON.stringify(profiledat));
    this.navController.navigateForward(['brithday'])
  }
  checkboxChanged(dato: any) {
    dato.dass.isSelected = !dato.dass.isSelected;
  }
}

