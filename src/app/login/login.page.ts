import { Component, OnInit } from '@angular/core';
import {FormGroup, FormControl, Validator, FormBuilder, Validators} from '@angular/forms';
import {StatusBar} from "@capacitor/status-bar";
import { NavController, ToastController } from '@ionic/angular';

import { ApiServiceService } from '../api-service.service';
import { IP_ADDRESS } from '../constantes';

import { Storage } from '@ionic/storage-angular';
import { sha256 } from 'crypto-hash';

import {  FacebookLogin,  FacebookLoginResponse,} from '@capacitor-community/facebook-login';


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

  FACEBOOK_APP_ID = '1017792489188521';

  constructor(public fb: FormBuilder,
    private apiService: ApiServiceService,
    private navController: NavController,
    public toastController: ToastController,
    private storage: Storage, ) {
    this.formularioLogin = this.fb.group({
      'nickname': new FormControl("",Validators.required),
      'password':new FormControl("",Validators.required)
    });
  }

  async  ngOnInit() {
    try {
      await FacebookLogin.initialize({ appId: this.FACEBOOK_APP_ID });
      console.log('Facebook plugin initialized successfully.');
    } catch (error) {
      console.error('Error initializing Facebook plugin:', error);
    }
  }

  async loginWithFacebook() {
    const FACEBOOK_PERMISSIONS = ['public_profile', 'email'];

    try {
      const result: FacebookLoginResponse = await FacebookLogin.login({ permissions: FACEBOOK_PERMISSIONS });

      if (result.accessToken && result.accessToken.token) {
        // El inicio de sesión fue exitoso, aquí puedes realizar las acciones necesarias con la información del usuario
        console.log('Facebook Login Response', result);

        // Obtener el token como una cadena
        const accessToken = result.accessToken.token;

        // Por ejemplo, puedes obtener información adicional del usuario haciendo una llamada a la API de Facebook
        const userInfo = await this.getUserInfoFromFacebook(accessToken);
        console.log('User Info from Facebook API', userInfo);
      } else {
        // El usuario canceló el inicio de sesión o ocurrió un error
        console.log('Facebook Login was not successful.');
      }
    } catch (error) {
      console.error('Error al iniciar sesión con Facebook', error);
    }
  }

  async getUserInfoFromFacebook(accessToken: string) {
    return { name: 'John Doe', email: 'john.doe@example.com' };
  }

  async initializeApp() {
    await this.storage.create();
  }

  ionViewWillEnter() {
    this.initializeApp();
  }

  async get_into (){
    var f= this.formularioLogin.value;
    var dataLogin ={
      nickname:f.nickname,
      password:f.password
    }
    const data = dataLogin;
    const hashedPassword = await this.consultarPasswordhas(data.nickname);
    const result = await this.passwordVerify(f.password, hashedPassword);
    if (result){
      this.apiService.consultLogin(data).subscribe(
        (response) => {
          var sesion ={
            token:response.token,
            nickname:response.nickname,
            rolUsuario:response.rolUsuario
          }
          if (response.message=="access user"){
            this.storage.set('sesion', JSON.stringify(sesion)).then(() => {
              this.navController.navigateForward('/main');
            });
          }else{
            if (response.message=="all access"){
              this.storage.set('sesion', JSON.stringify(sesion)).then(() => {
                this.navController.navigateForward('/activate-entrenadores');
              });
            }else {
              if (response.message=="access trainer"){
                this.storage.set('sesion', JSON.stringify(sesion)).then(() => {
                  this.navController.navigateForward('/users-trainers');
                });
              }else{
                if (response.message=="trainer not activated"){
                  this.storage.set('sesion', JSON.stringify(sesion)).then(() => {
                    this.navController.navigateForward('/notactivate');
                  });
                }else{
                  this.presentCustomToast("Error de Ingreso a la APP","danger");
                }
              }
            }
          }
        },
        (error) => {
          const errorMessage = error?.error?.message || 'Error desconocido';
          this.presentCustomToast(errorMessage, "danger");
        }
      );
    }else{
      this.presentCustomToast("Credenciales Invalidas", "danger");
    }
    dataLogin.nickname = '';
    dataLogin.password = '';
    this.formularioLogin.reset();
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
    async consultarPasswordhas(nickname: string): Promise<string> {
      try {
        const response = await this.apiService.getPasswordHash(nickname).toPromise();
        return response[0].CONTRASENIAPERSONA;
      } catch (error) {
        this.presentCustomToast("Usuario No Encontrado", "danger");
        return "";
      }
    }
    async passwordVerify(enteredPassword: string, hashedPassword: string): Promise<boolean> {
      try {
        const enteredHashedPassword = await sha256(enteredPassword);
        return enteredHashedPassword === hashedPassword;
      } catch (error) {
        console.error('Error al verificar la contraseña:', error);
        throw error;
      }
    }

}
