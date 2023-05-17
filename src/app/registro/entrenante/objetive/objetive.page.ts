import { Component, OnInit } from '@angular/core';
import { StatusBar } from '@capacitor/status-bar';
import { NavController } from '@ionic/angular';

import { ApiServiceService } from '../../../api-service.service';

import { IP_ADDRESS } from '../../../constantes';
@Component({
  selector: 'app-objetive',
  templateUrl: './objetive.page.html',
  styleUrls: ['./objetive.page.scss'],
})
export class ObjetivePage implements OnInit {
  public loading = true;
  public ip_address = IP_ADDRESS;
  isChecked: boolean[] = [false, false, false, false, false];
  datos: any[] = []; // Array para almacenar los datos
  constructor(private navController: NavController,
    private apiService: ApiServiceService) { }

  ngOnInit() {
  }
  goHome(){
    this.navController.navigateForward('/home');
  }
  public goBack(){
    this.navController.navigateForward(['/exercise-frequency'])
  }

  go_nextPage() {
    var profiledat = JSON.parse(localStorage.getItem('profilesdates')!);
    const updatedObjetive: number[] = [];
    for (let index = 0; index < this.isChecked.length; index++) {
      if (this.isChecked[index]) {
        updatedObjetive.push(index);
      }
    }
    profiledat.objetive = updatedObjetive.join(', ');
    localStorage.setItem('profilesdates', JSON.stringify(profiledat));
    this.navController.navigateForward(['/profession']);
  }

  ionViewDidEnter() {

    StatusBar.hide();
    StatusBar.setOverlaysWebView({overlay:true});
    StatusBar.setBackgroundColor({color:'#ffffff'});
    if (JSON.parse(localStorage.getItem('profilesdates')!)!=null){

    this.apiService.allObjetivosPersonales().subscribe(
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
        let i=0;
        this.datos.forEach((dato) => {
          const variableName = `--BackgroundButton${i + 1}`;
          const variableDetail = 'url(' + IP_ADDRESS +'/media/objetive/' + dato.BackgroundImage + ')';
          document.documentElement.style.setProperty(variableName,variableDetail);
          const variableNameCheck = `--BackgroundButton--checkmark${i + 1}`;
          const variableDetailCheck =dato.checkmarkcolor ;
          document.documentElement.style.setProperty(variableNameCheck,variableDetailCheck);
          const image = new Image();
          const imageButton = new Image();
          image.src = IP_ADDRESS + '/media/objetive/' + dato.BackgroundImage;
          imageButton.src = IP_ADDRESS + '/media/objetive/' + dato.BackgroundButton;
          image.onload = handleImageLoad;
          imageButton.onload = handleImageLoad;
          i++;
        });
      },
      (error) => {
        console.error(error); // Muestra el error en la consola en caso de que ocurra
      }
    );
    document.documentElement.style.setProperty('--background-ip-address','url('+IP_ADDRESS+'/media/objetive/background-ob.jpg)');
    }else{
      localStorage.removeItem('profilesdates');
      this.navController.navigateForward('/errorpage');
    }
  }

  handleCheckboxChange(checkboxClass: string) {
  const checkboxContainer = document.querySelector(`.${checkboxClass}`);
  if (checkboxContainer) {
    if (checkboxContainer.classList.contains('checked')) {
      checkboxContainer.classList.remove('checked');
    } else {
      checkboxContainer.classList.add('checked');
    }
  }
}
}
