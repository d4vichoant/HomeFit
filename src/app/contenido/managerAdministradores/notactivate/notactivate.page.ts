import { Component, OnInit } from '@angular/core';
import { IP_ADDRESS } from '../../../constantes';
import { StatusBar } from '@capacitor/status-bar';
import { NavController } from '@ionic/angular';
import { ApiServiceService } from '../../../api-service.service';

@Component({
  selector: 'app-notactivate',
  templateUrl: './notactivate.page.html',
  styleUrls: ['./notactivate.page.scss'],
})
export class NotactivatePage implements OnInit {
  public loading = true;
  public ip_address = IP_ADDRESS;
  constructor(private navController: NavController,
    private apiService: ApiServiceService) { }

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
    var sesion = JSON.parse(localStorage.getItem('sesion')!);
    if (sesion){
      this.apiService.protectedRequestWithToken(sesion.token).subscribe(
        (response) => {
          const image = new Image();
          image.src = IP_ADDRESS + '/media/notActivate/notactivate.png';
          // Cuando la imagen termine de cargar, ocultar el spinner
          image.onload = () => {
            this.loading = false;
          };
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
