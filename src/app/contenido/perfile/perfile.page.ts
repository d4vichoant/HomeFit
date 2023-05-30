import { Component, OnInit } from '@angular/core';
import { StatusBar } from '@capacitor/status-bar';
import { NavController, ToastController ,Animation, AnimationController } from '@ionic/angular';
import { ApiServiceService } from '../../api-service.service';
import { Storage } from '@ionic/storage-angular';
import { IP_ADDRESS } from '../../constantes';


@Component({
  selector: 'app-perfile',
  templateUrl: './perfile.page.html',
  styleUrls: ['./perfile.page.scss'],
})
export class PerfilePage implements OnInit {
  public loading = true;
  public ip_address = IP_ADDRESS;
  public password!: string;
  public confirmPassword!: string;
  public hashpassword!: string;
  public dataPerfil!: any[] ;
  public originalDataPerfil!: any[];

  currentTab = 1;

  overlayVisible: boolean = false;

  passwordType1: string = 'password';
  passwordIcon1: string = 'eye-outline';
  passwordType2: string = 'password';
  passwordIcon2: string = 'eye-outline';

  constructor(private navController: NavController,
    private apiService: ApiServiceService,
    private storage: Storage,
    public toastController: ToastController,
    private animationCtrl: AnimationController) { }

  ngOnInit() {
    // this.obtenerPerfileUniq("administrador");
    // this.loading = false;
    this.StatusBar();
    this.validartoken();
  }

  ionViewDidEnter() {
    this.StatusBar();
    this.validartoken();
  }

  private StatusBar(){
    StatusBar.hide();
    StatusBar.setOverlaysWebView({ overlay: true });
    StatusBar.setBackgroundColor({ color: '#ffffff' });
  }
  private validartoken(){
    try {
      this.storage.get('sesion').then((sesionString) => {
          if (sesionString) {
            const sesion = JSON.parse(sesionString);
            this.apiService.protectedRequestWithToken(sesion.token).subscribe(
              (response) => {
                this.loading = false;
                this.obtenerPerfileUniq(sesion.nickname);
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
  public togglePopup(): void {
    this.overlayVisible = !this.overlayVisible;

    const animation = this.animatePopup(this.overlayVisible);

    animation.play(); // Ejecutar la animación
  }


  private animatePopup(show: boolean): Animation {
    const rawData = this.dataPerfil;
    this.originalDataPerfil = rawData.map(item => ({ ...item }));
    this.loading=true;
    const animation = this.animationCtrl.create()
      .addElement(document.querySelector('.popup')!)
      .duration(300);

    if (show) {
      // Animación para mostrar el popup
      animation
        .fromTo('opacity', '0', '1')
        .fromTo('transform', 'translateY(100%)', 'translateY(0)');
    } else {
      // Animación para ocultar el popup
      animation
        .fromTo('opacity', '1', '0')
        .fromTo('transform', 'translateY(0)', 'translateY(100%)');
    }

     this.loading=false;
    return animation;
  }


  private handleError() {
    this.loading = false;
    this.navController.navigateForward('/errorpage');
    this.storage.remove('sesion');
  }
  sign_off()
  {
    this.storage.remove('sesion');
    this.navController.navigateForward('/login');

  }
  go_page(name: string){
    this.navController.navigateForward('/'+name);
  }
  updateNewPassword(item :any){
    if (this.password && this.confirmPassword){
      if(this.password === this.confirmPassword){
        if (this.validatePassword(this.password)){
          this.passwordEncode(item);
          console.log(this.hashpassword);
        }else{
          this.presentCustomToast("No cumple como una contraseña segura","warning");
        }
      }else{
        this.presentCustomToast("Ambas contraseñas deben coincidir","warning");
      }
    }else{
      this.presentCustomToast("Debe llenar todos los campos","warning");
    }
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
      this.storage.get('sesion').then((sesionString) => {
        if (sesionString) {
          var profiledat = JSON.parse(sesionString);
          item.USUARIOMODIFICACIONPERSONA = profiledat.nickname;
          this.loading = true;
          console.log(item);
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
        } else {
          this.presentCustomToast('No se encontró la sesión', "danger");
        }
      });
    })
    .catch(error => {
      this.presentCustomToast('Error al guardar la contraseña', "danger");
    });
}

  obtenerPrimerNombre(nombreCompleto: string): string {
    const nombres = nombreCompleto.split(" ");
    return nombres[0];
  }
  showTab(tabNumber: number) {
    this.presentCustomToast("Recuerde Guardar en cada Pestaña","warning");
    this.currentTab = tabNumber;
  }
  cancelarButton(){
      this.dataPerfil = this.originalDataPerfil;
      this.password='';
      this.confirmPassword='';
      this.togglePopup()
  }

  isTabSelected(tabNumber: number): boolean {
    return this.currentTab === tabNumber;
  }

  actualizarUsuario(dataUser :any){
    this.storage.get('sesion').then((sesionString) => {
      if (sesionString) {
        var profiledat = JSON.parse(sesionString);
        dataUser.USUARIOMODIFICACIONPERSONA = profiledat.nickname;
        this.loading = true;
        this.apiService.UpdateProfileBasic(dataUser).subscribe(
          (response) => {
            this.presentCustomToast(response.message, "success");
            this.loading = false;
            this.togglePopup();
          },
          (error) => {
            this.presentCustomToast(error.error.error, "danger");
          }
        );
      } else {
        // No se encontró la sesión en el storage
        console.log('No se encontró la sesión');
      }
    });

  }
  getFormattedDate(dateString: string): string {
  if (!dateString) return ''; // Manejar el caso cuando la fecha no está definida

  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = ('0' + (date.getMonth() + 1)).slice(-2);
  const day = ('0' + date.getDate()).slice(-2);

  return `${year}-${month}-${day}`;
}

updateNgModel(event: any, dataall:any){
  const target = event.target as HTMLInputElement;
  const value = target.value;
  dataall.FECHANACIMIENTOPERSONA =value;
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
