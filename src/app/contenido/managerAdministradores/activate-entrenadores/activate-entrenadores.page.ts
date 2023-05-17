import { Component, OnInit } from '@angular/core';
import { StatusBar } from '@capacitor/status-bar';
import { ApiServiceService } from '../../../api-service.service';
import { NavController } from '@ionic/angular';
import { AnimationController } from '@ionic/angular';

@Component({
  selector: 'app-activate-entrenadores',
  templateUrl: './activate-entrenadores.page.html',
  styleUrls: ['./activate-entrenadores.page.scss'],
})
export class ActivateEntrenadoresPage implements OnInit {
  public loading = true;
  constructor(private navController: NavController,
    private apiService: ApiServiceService,
    private animationCtrl: AnimationController) { }

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

  animateOption(option: string) {
    const buttonElement = document.querySelector(`ion-button:contains(${option})`);

    if (buttonElement) {
      const animation = this.animationCtrl.create()
        .addElement(buttonElement)
        .fromTo('transform', 'translateY(0)', 'translateY(-100%)')
        .duration(500);

      animation.play();
    }
  }
}
