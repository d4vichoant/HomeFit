import { Component, OnInit } from '@angular/core';
import { NavController, ToastController } from '@ionic/angular';
import { IP_ADDRESS } from '../../constantes';
import { Storage } from '@ionic/storage-angular';
import { ApiServiceService } from '../../api-service.service';

@Component({
  selector: 'app-footer-designer-users',
  templateUrl: './footer-designer-users.component.html',
  styleUrls: ['./footer-designer-users.component.scss'],
})
export class FooterDesignerUsersComponent  implements OnInit {

  public ip_address = IP_ADDRESS;
  public elementoActivo!: number ;

  public userSesion!:string;
  public userSesionPerfil!:any;

  public animateElement1 = false;
  public animateElement2 = false;
  public animateElement3 = false;
  public animateElement4 = false;
  public animateElement5 = false;
  constructor(
    private navController: NavController,
    private storage: Storage,
    private apiService: ApiServiceService,
    public toastController: ToastController
  ) { }

  ngOnInit() {}

  go_page(name: string){
    this.navController.navigateForward('/'+name);
  }
  go_animate(type:number,namePage:string){
    switch (type) {
      case 1:
        this.animateElement1 = true;
        break;
      case 2:
        this.animateElement2 = true;
        break;
      case 3:
        this.animateElement3 = true;
        break;
      case 4:
        this.animateElement4 = true;
        break;
      case 5:
        this.animateElement5 = true;
        break;
      default:
        break;
    }
    setTimeout(() => {
      this.go_page(namePage);
      this.resetAnimateElements();
    }, 500);
  }
  resetAnimateElements() {
    this.animateElement1 = false;
    this.animateElement2 = false;
    this.animateElement3 = false;
    this.animateElement4 = false;
    this.animateElement5 = false;
  }
  async presentCustomToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2400,
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
