import { Component, OnInit } from '@angular/core';
import {FormGroup, FormControl, Validator, FormBuilder, Validators} from '@angular/forms';
import {StatusBar} from "@capacitor/status-bar";
import { Keyboard } from '@capacitor/keyboard';
import { NavController, ToastController } from '@ionic/angular';

import { ApiServiceService } from '../api-service.service';
import { IP_ADDRESS } from '../constantes';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  public loading = true;
  passwordType: string = 'password';
  passwordIcon: string = 'eye-outline';
  formularioLogin: FormGroup;
  keyboardHeight: number = 0;
  public ip_address = IP_ADDRESS;

  constructor(public fb: FormBuilder,
    private apiService: ApiServiceService,
    private navController: NavController,
    public toastController: ToastController) {
    this.formularioLogin = this.fb.group({
      'nickname': new FormControl("",Validators.required),
      'password':new FormControl("",Validators.required)
    });
  }

  ngOnInit() {
  }

  ionViewWillEnter() {
    Keyboard.addListener('keyboardWillShow', (event) => {
      this.keyboardHeight = event.keyboardHeight;
      document.body.style.setProperty('--ion-safe-area-bottom', `${this.keyboardHeight}px`);
    });
    Keyboard.addListener('keyboardWillHide', () => {
      this.keyboardHeight = 0;
      document.body.style.setProperty('--ion-safe-area-bottom', '0px');
    });
  }

  get_into (){
    var f= this.formularioLogin.value;
    var dataLogin ={
      nickname:f.nickname,
      password:f.password
    }
    const data = dataLogin;
    this.apiService.consultLogin(data).subscribe(
      (response) => {
        this.presentCustomToast(response.message,"success");
        this.navController.navigateForward('/main');
      },
      (error) => {
        const errorMessage = error?.error?.message || 'Error desconocido';
        this.presentCustomToast(errorMessage, "danger");
      }
    );

  }

  goRegister(){

  }

  togglePassword() {
    if (this.passwordType === 'password') {
      this.passwordType = 'text';
      this.passwordIcon = 'eye-off-outline';
    } else {
      this.passwordType = 'password';
      this.passwordIcon = 'eye-outline';
    }
  }

  ionViewDidEnter() {
    StatusBar.hide();
    StatusBar.setOverlaysWebView({overlay:true})
    StatusBar.setBackgroundColor({color:'#ffffff'})
    const image = new Image();
    document.documentElement.style.setProperty('--background-ip-address','url('+IP_ADDRESS+'/media/login/background.jpg)');
    image.src = IP_ADDRESS+'/media/login/background.jpg';
    // Cuando la imagen termine de cargar, ocultar el spinner
    image.onload = () => {
      this.loading = false;
    };
  }
  get_into_with_google(){
    this.navController.navigateForward('/main');
  }
  get_into_with_facebook(){
    this.navController.navigateForward('/main');
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
