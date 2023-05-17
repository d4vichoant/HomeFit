import { Component, OnInit } from '@angular/core';
import { StatusBar } from '@capacitor/status-bar';
import { NavController } from '@ionic/angular';

import { ApiServiceService } from '../../../api-service.service';

import { IP_ADDRESS } from '../../../constantes';

@Component({
  selector: 'app-exercise-frequency',
  templateUrl: './exercise-frequency.page.html',
  styleUrls: ['./exercise-frequency.page.scss'],
})
export class ExerciseFrequencyPage implements OnInit {
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
    this.navController.navigateForward(['/w-and-h'])
  }

  go_nextPage(){
    this.navController.navigateForward(['/objetive'])
  }

  ngAfterViewInit() {

  }
  ionViewDidEnter() {
    StatusBar.hide();
    StatusBar.setOverlaysWebView({overlay:true});
    StatusBar.setBackgroundColor({color:'#ffffff'});
    if (JSON.parse(localStorage.getItem('profilesdates')!)!=null){

    this.apiService.allfrecuenciaejercicio().subscribe(
      (data) => {
        this.datos = data; // Almacena los datos en el array
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
          image.src = IP_ADDRESS + '/media/exercise-freq/' + dato.BackgroundImageButton;
          image.onload = handleImageLoad;
        });
      },
      (error) => {
        console.error(error); // Muestra el error en la consola en caso de que ocurra
      }
    );
    document.documentElement.style.setProperty('--background-ip-address','url('+IP_ADDRESS+'/media/exercise-freq/background-ef.jpg)');
    }else{
      localStorage.removeItem('profilesdates');
      this.navController.navigateForward('/errorpage');
    }
  }
  buttonClicked(buttonNumber: number) {
    var profiledat = JSON.parse(localStorage.getItem('profilesdates')!);
    profiledat.frecuency = buttonNumber;
    localStorage.setItem('profilesdates', JSON.stringify(profiledat));
    this.go_nextPage();
  }
}
