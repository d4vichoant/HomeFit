import { Component, OnInit } from '@angular/core';
import { StatusBar } from '@capacitor/status-bar';
import { NavController } from '@ionic/angular';

import { IP_ADDRESS } from '../constantes';

@Component({
  selector: 'app-gender',
  templateUrl: './gender.page.html',
  styleUrls: ['./gender.page.scss'],
})
export class GenderPage implements OnInit {
  public loading = true;
  selectedRadioValue: string = '';
  public ip_address = IP_ADDRESS;
  constructor(private navController: NavController) { }

  ngOnInit() {

  }

  goHome(){
    this.navController.navigateForward('/home');
  }
  public goBack(){
    this.navController.navigateForward(['/password'])
  }


  ionViewDidEnter() {
    StatusBar.hide();
    StatusBar.setOverlaysWebView({overlay:true});
    StatusBar.setBackgroundColor({color:'#ffffff'});

    document.documentElement.style.setProperty('--background-ip-address','url('+IP_ADDRESS+'/media/genders/background-genders.jpg)');

    let imagesLoaded = 0;
    const image1 = new Image();
    const image2 = new Image();
    const image3 = new Image();
    image1.src = IP_ADDRESS+'/media/genders/female.png';
    image2.src = IP_ADDRESS+'/media/genders/masculine.png';
    image3.src = IP_ADDRESS+'/media/genders/background-genders.jpg';

    const handleImageLoad = () => {
      imagesLoaded++;
      if (imagesLoaded === 3) {
        this.loading = false;
      }
    };

    image1.onload = handleImageLoad;
    image2.onload = handleImageLoad;
    image3.onload = handleImageLoad;

  }
  prefer_noAnswer(){
    this.selectedRadioValue ='';
    this.go_nextPage();
  }
  go_nextPage(){
    var profiledat = JSON.parse(localStorage.getItem('profilesdates')!);
    if (this.selectRadio!=null){
      if(this.selectedRadioValue == "custom"){
        profiledat.gender = 1;
      }else{
        if (this.selectedRadioValue == "custom-checked"){
          profiledat.gender = 0;
        }else{
          profiledat.gender = 2;
        }
      }
    }else{
      profiledat.gender = null;
    }
    localStorage.setItem('profilesdates', JSON.stringify(profiledat));
    this.navController.navigateForward(['brithday'])
  }
  selectRadio(value: string) {
    this.selectedRadioValue = value;
    setTimeout(() => {
      this.go_nextPage();
    }, 100);
  }
}
