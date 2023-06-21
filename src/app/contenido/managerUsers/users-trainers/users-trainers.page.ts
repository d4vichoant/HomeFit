import { Component, OnInit } from '@angular/core';
import { IP_ADDRESS } from '../../../constantes';
import { ApiServiceService } from '../../../api-service.service';
import { StatusBar } from '@capacitor/status-bar';
import { Storage } from '@ionic/storage-angular';
import { NavController } from '@ionic/angular';
@Component({
  selector: 'app-users-trainers',
  templateUrl: './users-trainers.page.html',
  styleUrls: ['./users-trainers.page.scss'],
})
export class UsersTrainersPage implements OnInit {
  public loading = true;
  public ip_address = IP_ADDRESS;
  constructor(private storage: Storage,
    private apiService: ApiServiceService,
    private navController: NavController,) { }

    ionViewDidEnter(){
      this.validateSesion();
      this.cargarImagenesBefores();
      //this.test()
    }
    ngOnInit() {
      this.validateSesion();
      this.cargarImagenesBefores();
      //this.test()
    }
    test(){
      this.loading=false;
    }
    StatusBar(){
      StatusBar.hide();
      StatusBar.setOverlaysWebView({ overlay: true });
      StatusBar.setBackgroundColor({ color: '#ffffff' });
    }
    private chanceColorFooter(){
      document.documentElement.style.setProperty('--activate-foot10',' #9259f9');
      document.documentElement.style.setProperty('--activate-foot11',' #9259f9');
      document.documentElement.style.setProperty('--activate-foot20',' transparent');
      document.documentElement.style.setProperty('--activate-foot21',' #6b6a6b');
      document.documentElement.style.setProperty('--activate-foot30',' transparent');
      document.documentElement.style.setProperty('--activate-foot31',' #6b6a6b');
      document.documentElement.style.setProperty('--activate-foot40',' transparent');
      document.documentElement.style.setProperty('--activate-foot41',' #6b6a6b');
    }
    validateSesion(){
      try{
        this.storage.get('sesion').then((sesion) => {
          if (sesion && JSON.parse(sesion).rolUsuario == 2) {
            this.apiService.protectedRequestWithToken(JSON.parse(sesion).token).subscribe(
              (response) => {
                this.chanceColorFooter();
                this.StatusBar();
                //this.loading = false;
              },
              (error) => {
                this.handleError();
              }
            );
          } else {
            this.handleError();
          }
        });
      } catch (error) {
        this.handleError();
      }
    }
    private handleError() {
      this.loading = false;
      this.navController.navigateForward('/error-page-users-trainers');
      this.storage.remove('sesion');
    }

    cargarImagenesBefores(){
      let imagesLoaded = 0;
      const image1 = new Image();
      const image2 = new Image();
      image1.src = IP_ADDRESS + '/media/images/objetive-muscular-bk-1.png';
      image2.src = IP_ADDRESS + '/media/images/objetive-muscular-bk-2.png';

      const handleImageLoad = () => {
        imagesLoaded++;
        if (imagesLoaded === 2) {
          this.loading = false;
        }
      };

      image1.onload = handleImageLoad;
      image2.onload = handleImageLoad;
    }
}
