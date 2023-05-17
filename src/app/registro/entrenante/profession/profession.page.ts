import { Component, OnInit } from '@angular/core';
import { StatusBar } from '@capacitor/status-bar';
import { NavController } from '@ionic/angular';

import { IP_ADDRESS } from '../../../constantes';
@Component({
  selector: 'app-profession',
  templateUrl: './profession.page.html',
  styleUrls: ['./profession.page.scss'],
})
export class ProfessionPage implements OnInit {
  public loading = true;
  public ip_address = IP_ADDRESS;
  constructor(private navController: NavController) { }

  ngOnInit() {
  }

  goHome(){
    this.navController.navigateForward('/home');
  }
  public goBack(){
    this.navController.navigateForward(['/objetive']);
  }
  ionViewDidEnter() {
    StatusBar.hide();
    StatusBar.setOverlaysWebView({overlay:true});
    StatusBar.setBackgroundColor({color:'#ffffff'});

    if (JSON.parse(localStorage.getItem('profilesdates')!)!=null){

    let imagesLoaded = 0;
    const image1 = new Image();
    const image2 = new Image();
    const image3 = new Image();
    const image4 = new Image();
    const image5 = new Image();
    const image6 = new Image();
    const image7 = new Image();
    const image8 = new Image();
    const image9 = new Image();
    image1.src = IP_ADDRESS + '/media/profession/medicina.jpg';
    image2.src = IP_ADDRESS + '/media/profession/educacion.jpg';
    image3.src = IP_ADDRESS + '/media/profession/tecnologias.jpg';
    image4.src = IP_ADDRESS + '/media/profession/servicios.jpg';
    image5.src = IP_ADDRESS + '/media/profession/ingenieria.jpg';
    image6.src = IP_ADDRESS + '/media/profession/finanzas.jpg';
    image7.src = IP_ADDRESS + '/media/profession/ventas.jpg';
    image8.src = IP_ADDRESS + '/media/profession/arte.jpg';
    image9.src = IP_ADDRESS + '/media/profession/ciencias.jpg';

    const handleImageLoad = () => {
      imagesLoaded++;
      if (imagesLoaded === 9) {
        this.loading = false;
      }
    };

    image1.onload = handleImageLoad;
    image2.onload = handleImageLoad;
    image3.onload = handleImageLoad;
    image4.onload = handleImageLoad;
    image5.onload = handleImageLoad;
    image6.onload = handleImageLoad;
    image7.onload = handleImageLoad;
    image8.onload = handleImageLoad;
    image9.onload = handleImageLoad;
    }else{
      localStorage.removeItem('profilesdates');
      this.navController.navigateForward('/errorpage');
    }
  }
  go_nextPage(){
    this.navController.navigateForward(['notification-permission']);
  }
  seleccion(area:number){
    var profiledat = JSON.parse(localStorage.getItem('profilesdates')!);
    profiledat.profession = area;
    localStorage.setItem('profilesdates', JSON.stringify(profiledat));
    this.go_nextPage();
  }
}
