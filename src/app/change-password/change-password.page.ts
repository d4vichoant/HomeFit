import { Component, OnInit } from '@angular/core';
import { NavController, ToastController } from '@ionic/angular';
import { ApiServiceService } from '../api-service.service';
import { Storage } from '@ionic/storage-angular';
import { StatusBar, StatusBarStyle } from '@capacitor/status-bar';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.page.html',
  styleUrls: ['./change-password.page.scss'],
})
export class ChangePasswordPage implements OnInit {
  public loading = true;

  public password!: string;
  public confirmPassword!: string;
  public hashpassword!: string;

  public dataPerfil!: any[] ;

  passwordType1: string = 'password';
  passwordIcon1: string = 'eye-outline';
  passwordType2: string = 'password';
  passwordIcon2: string = 'eye-outline';

  textUserEmail!:any[];

  constructor(
    public toastController: ToastController,
    private apiService: ApiServiceService,
    private storage: Storage,
    private navController: NavController,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.inicializarPage();
  }
  ionViewDidEnter() {
    this.inicializarPage();
  }

  inicializarPage(){
    this.StatusBar();
    this.recuperarDatos();
    this.validartoken();
  }
  recuperarDatos(){
    this.route.queryParams.subscribe(params => {
      this.textUserEmail = params['variableRecuperarPassword'];
    });
  }
  private validartoken(){
    try {
      if (this.textUserEmail && this.textUserEmail.length>0) {
        this.obtenerPerfileUniq(this.textUserEmail[0].NICKNAMEPERSONA);
        this.loading = false;
      } else {
        this.handleError();
      }
    } catch (error) {
      this.handleError();
    }
  }

  private StatusBar(){
    StatusBar.setOverlaysWebView({ overlay: true });
    StatusBar.setBackgroundColor({color:'transparent'});
    StatusBar.setStyle({ style: StatusBarStyle.Dark });
  }

  private handleError() {
    this.loading = false;
    this.navController.navigateForward('/errorpage');
    this.storage.remove('sesion');
  }

  validatePassword(password: string): boolean {
    const minLength = 8;
    const symbolRegex = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/;
    const uppercaseRegex = /[A-Z]/;
    const numberRegex = /\d/g;

    // Verificar la longitud mínima
    if (password.length < minLength) {
      return false;
    }

    // Verificar al menos 1 símbolo
    if (!symbolRegex.test(password)) {
      return false;
    }

    // Verificar al menos 1 mayúscula
    if (!uppercaseRegex.test(password)) {
      return false;
    }

    // Verificar más de 1 número
    const numbersCount = (password.match(numberRegex) || []).length;
    if (numbersCount < 2) {
      return false;
    }

    return true;
  }


  passwordEncode(item:any) {
    let password = this.password;
    const encoder = new TextEncoder();
    const data = encoder.encode(password);

    window.crypto.subtle.digest('SHA-256', data)
      .then(hashBuffer => {
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashedPassword = hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');
        item.CONTRASENIAPERSONA=hashedPassword;
        item.USUARIOMODIFICACIONPERSONA = this.textUserEmail[0].NICKNAMEPERSONA;
        this.loading = true;
        this.apiService.UpdatePassword(item).subscribe(
          (response) => {
            this.presentCustomToast(response.message, "success");
            this.password='';
            this.confirmPassword='';
            this.sign_off();
          },
          (error) => {
            this.presentCustomToast(error.error.error, "danger");
          }
        );

      })
      .catch(error => {
        this.presentCustomToast('Error al guardar la contraseña', "danger");
      });
  }
  sign_off()
  {
    this.storage.remove('sesion');
    this.navController.navigateForward('/login');

  }

  togglePassword(passwordIndex: number) {
    if (passwordIndex === 1) {
      if (this.passwordType1 === 'password') {
        this.passwordType1 = 'text';
        this.passwordIcon1 = 'eye-off-outline';
      } else {
        this.passwordType1 = 'password';
        this.passwordIcon1 = 'eye-outline';
      }
    } else if (passwordIndex === 2) {
      if (this.passwordType2 === 'password') {
        this.passwordType2 = 'text';
        this.passwordIcon2 = 'eye-off-outline';
      } else {
        this.passwordType2 = 'password';
        this.passwordIcon2 = 'eye-outline';
      }
    }
  }

  go_page(name: string){
    this.navController.navigateForward('/'+name);
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

    cancelarButton(){
      this.password='';
      this.confirmPassword='';
      this.go_page('login');
  }

  updateNewPassword(item :any){
    if (this.password && this.confirmPassword){
      if(this.password === this.confirmPassword){
        if (this.validatePassword(this.password)){
          this.passwordEncode(item);
        }else{
          this.presentCustomToast("No cumple como una contraseña segura","danger");
        }
      }else{
        this.presentCustomToast("Ambas contraseñas deben coincidir","danger");
      }
    }else{
      this.presentCustomToast("Debe llenar todos los campos","danger");
    }
  }
  obtenerPerfileUniq(nickname:string){
    this.apiService.PerfileUniq(nickname).subscribe(
      (response) => {
        this.dataPerfil=response;
      },
      (error) => {
        this.presentCustomToast(error.error,"danger");
      }
    );
  }

}
