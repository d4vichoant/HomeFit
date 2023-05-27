import { Component, OnInit } from '@angular/core';
import { ApiServiceService } from '../api-service.service';
import { StatusBar } from '@capacitor/status-bar';
import { NavController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';

@Component({
  selector: 'app-main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
})
export class MainPage implements OnInit {

  constructor(private navController: NavController,
    private apiService: ApiServiceService,
    private storage: Storage) { }
  public loading = true;
  ngOnInit() {
  }
  ionViewDidEnter() {
    StatusBar.hide();
    StatusBar.setOverlaysWebView({ overlay: true });
    StatusBar.setBackgroundColor({ color: '#ffffff' });

    this.storage.get('sesion').then((sesionString) => {
      if (sesionString) {
        const sesion = JSON.parse(sesionString);
        this.apiService.protectedRequestWithToken(sesion.token).subscribe(
          (response) => {
            this.loading = false;
          },
          (error) => {
            this.loading = false;
            this.navController.navigateForward('/errorpage');
            this.storage.remove('sesion');
          }
        );
      } else {
        this.loading = false;
        this.storage.remove('sesion');
        this.navController.navigateForward('/errorpage');
      }
    });
  }
}

