import { Component, OnInit } from '@angular/core';
import { ApiServiceService } from '../api-service.service';
import { StatusBar } from '@capacitor/status-bar';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
})
export class MainPage implements OnInit {

  constructor(private navController: NavController,
    private apiService: ApiServiceService) { }
  public loading = true;
  ngOnInit() {
  }
  ionViewDidEnter() {
    StatusBar.hide();
    StatusBar.setOverlaysWebView({overlay:true});
    StatusBar.setBackgroundColor({color:'#ffffff'});
    var sesion = JSON.parse(localStorage.getItem('sesion')!);
    if (sesion){
      this.apiService.protectedRequestWithToken(sesion.token).subscribe(
        (response) => {
          this.loading = false;
        },
        (error) => {
          this.loading = false;
          this.navController.navigateForward('/errorpage');
          localStorage.removeItem('sesion');
        }
      );
    }else{
      this.loading = false;
      localStorage.removeItem('sesion');
      this.navController.navigateForward('/errorpage');
    }
  }
}

