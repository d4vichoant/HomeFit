import { Component, OnInit } from '@angular/core';
import { IP_ADDRESS } from '../constantes';
import { StatusBar } from '@capacitor/status-bar';
import { NavController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';


@Component({
  selector: 'app-error-users',
  templateUrl: './error-users.page.html',
  styleUrls: ['./error-users.page.scss'],
})
export class ErrorUsersPage implements OnInit {

  public loading = true;
  public ip_address = IP_ADDRESS;
  constructor(private navController: NavController,
    private storage: Storage) { }

  ngOnInit() {
  }
  goHome(){
    this.navController.navigateForward('/home');
    localStorage.removeItem('sesion');
  }
  ionViewDidEnter() {
    StatusBar.hide();
    StatusBar.setOverlaysWebView({overlay:true});
    StatusBar.setBackgroundColor({color:'#ffffff'});
    const image = new Image();
    image.src = IP_ADDRESS + '/media/errorpage/notfound.png';
    // Cuando la imagen termine de cargar, ocultar el spinner
    image.onload = () => {
      this.loading = false;
    };
    this.storage.remove('sesion');

  }

}
