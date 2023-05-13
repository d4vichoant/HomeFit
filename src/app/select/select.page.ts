import { Component, OnInit } from '@angular/core';
import { StatusBar } from '@capacitor/status-bar';
import { NavController } from '@ionic/angular';
import { IP_ADDRESS } from '../constantes';
@Component({
  selector: 'app-select',
  templateUrl: './select.page.html',
  styleUrls: ['./select.page.scss'],
})
export class SelectPage implements OnInit {
  public ip_address = IP_ADDRESS;
  public loading = true;
  imagenCompleta = false;
  imagenSeleccionada!: string;
  constructor(private navController: NavController) {
    this.imagenCompleta = false;
  }

  ngOnInit() {
    this.imagenCompleta = false;
    StatusBar.hide();
    StatusBar.setOverlaysWebView({overlay:true});
    StatusBar.setBackgroundColor({color:'#ffffff'});
  }

  ionViewDidEnter() {

    let imagesLoaded = 0;
    const image1 = new Image();
    const image2 = new Image();
    const image3 = new Image();
    const image4 = new Image();
    image1.src = IP_ADDRESS + '/media/select/entrenador1.jpg';
    image2.src = IP_ADDRESS + '/media/select/entrenador2.jpg';
    image3.src = IP_ADDRESS + '/media/select/entrenador3.jpg';
    image4.src = IP_ADDRESS + '/media/select/entrenador4.jpg';

    const handleImageLoad = () => {
      imagesLoaded++;
      if (imagesLoaded === 4) {
        this.loading = false;
      }
    };

    image1.onload = handleImageLoad;
    image2.onload = handleImageLoad;
    image3.onload = handleImageLoad;
    image4.onload = handleImageLoad;
  }
  public go_nextPage(){
    this.navController.navigateForward(['/profile-basic']);
  }

  goHome(){
    this.navController.navigateForward('/home');
  }
  public goBack(){
    this.navController.navigateForward('/home');
  }
  mostrarImagenCompleta(imagen: string) {
    console.log(imagen);
    if (imagen == "imagen1"){
      var profiledat ={
        rolusuario:1,
      }
    }else{
      var profiledat ={
        rolusuario:2,
      }
    }
    localStorage.setItem('profilesdates',JSON.stringify(profiledat));
    this.imagenSeleccionada = imagen;
    this.imagenCompleta = true;
    setTimeout(() => {
      this.go_nextPage();
      this.imagenCompleta = false;
     }, 250);
  }
}
