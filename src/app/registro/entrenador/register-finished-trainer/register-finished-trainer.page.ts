import { Component, OnInit } from '@angular/core';

import { IP_ADDRESS } from '../../../constantes';
import { StatusBar } from '@capacitor/status-bar';
import { NavController } from '@ionic/angular';
@Component({
  selector: 'app-register-finished-trainer',
  templateUrl: './register-finished-trainer.page.html',
  styleUrls: ['./register-finished-trainer.page.scss'],
})
export class RegisterFinishedTrainerPage implements OnInit {
  public loading = true;
  public ip_address = IP_ADDRESS;
  constructor(private navController: NavController) { }

  ngOnInit() {
  }
  goHome(){
    this.navController.navigateForward('/home');
  }

  ionViewDidEnter() {
    StatusBar.hide();
    StatusBar.setOverlaysWebView({overlay:true});
    StatusBar.setBackgroundColor({color:'#ffffff'});
    if (JSON.parse(localStorage.getItem('profilesdates')!)!=null){
    const image = new Image();
    image.src = IP_ADDRESS + '/media/notification-permission/notification.png';
    // Cuando la imagen termine de cargar, ocultar el spinner
    image.onload = () => {
      this.loading = false;
    };
    }else{
      localStorage.removeItem('profilesdates');
      this.navController.navigateForward('/errorpage');
    }
  }
}
