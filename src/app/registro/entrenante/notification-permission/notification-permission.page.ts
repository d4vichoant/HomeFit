import { Component, OnInit } from '@angular/core';
import { StatusBar } from '@capacitor/status-bar';
import { NavController, ToastController } from '@ionic/angular';
import { ApiServiceService } from '../../../api-service.service';

import { IP_ADDRESS } from '../../../constantes';

@Component({
  selector: 'app-notification-permission',
  templateUrl: './notification-permission.page.html',
  styleUrls: ['./notification-permission.page.scss'],
})
export class NotificationPermissionPage implements OnInit {
  public loading = true;
  currentStep = 1;
  public ip_address = IP_ADDRESS;
  constructor(private navController: NavController,
    private apiService: ApiServiceService,
    public toastController: ToastController) { }

  ngOnInit() {
    var profiledat = JSON.parse(localStorage.getItem('profilesdates')!);
    console.log(profiledat);

  }
  postData() {
    var profiledat = JSON.parse(localStorage.getItem('profilesdates')!);
    const data = profiledat;
    //console.log(data);
    this.apiService.saveProfile(data).subscribe(
      (response) => {
        this.presentCustomToast(response.message,"success");
        console.log(data);
        localStorage.removeItem('profilesdates');
        this.navController.navigateForward('/login');
      },
      (error) => {
        console.error('Error al llamar a la API:', error);
        this.presentCustomToast(error,"danger");
      }
    );
  }

  goHome(){
    this.navController.navigateForward('/home');
  }
  go_nextPage(){
    var profiledat = JSON.parse(localStorage.getItem('profilesdates')!);
    profiledat.status=true;
    localStorage.setItem('profilesdates', JSON.stringify(profiledat));
    this.postData();
  }
  public goBack(){
    this.navController.navigateForward(['/profession'])
  }
  go_notNow(){
    var profiledat = JSON.parse(localStorage.getItem('profilesdates')!);
    profiledat.notification = false;
    localStorage.setItem('profilesdates', JSON.stringify(profiledat));
    this.go_nextPage();
  }
  go_Now(){
    var profiledat = JSON.parse(localStorage.getItem('profilesdates')!);
    profiledat.notification = true;
    localStorage.setItem('profilesdates', JSON.stringify(profiledat));
    this.go_nextPage();
  }


  ngAfterViewInit() {
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

  async presentCustomToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 1400,
      position: 'top',
      cssClass: `toast-custom-${color}`,
      buttons: [
        {
          side: 'end',
          icon: 'close',
          role: 'cancel'
        }
      ]
    });
      const alertElement = document.querySelector(`.toast-custom-${color}`) as HTMLDivElement;
      alertElement.style.setProperty('--alert-top', `calc(50% + (9% * 0) + 8%)`);
      toast.present();
    }
}
