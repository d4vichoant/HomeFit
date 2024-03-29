import { Component, OnInit,ElementRef,ViewChild } from '@angular/core';
import { StatusBar, StatusBarStyle } from '@capacitor/status-bar';
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
  @ViewChild('fileInputRef') fileInputRef!: ElementRef;

  selectedFile: File | null = null;
  nameFile:string='';
  selectedImageUrl!:string;

  public selectImage!:string;

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
    StatusBar.setOverlaysWebView({ overlay: true });
    StatusBar.setBackgroundColor({color:'transparent'});
    StatusBar.setStyle({ style: StatusBarStyle.Dark });
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
  private chanceColorFooter(){
    if(this.dataPerfil && this.dataPerfil[0].IDROLUSUARIO===1){
      document.documentElement.style.setProperty('--background-ip-address-perfile','linear-gradient(0deg, #00000060, #33333394),url('+IP_ADDRESS+'/media/perfile/perfilebackground.jpg) no-repeat center center / cover');
      document.documentElement.style.setProperty('--activate-foot10',' transparent');
      document.documentElement.style.setProperty('--activate-foot11',' #ffffffab');
      document.documentElement.style.setProperty('--activate-foot12',' transparent');
      document.documentElement.style.setProperty('--activate-foot20',' transparent');
      document.documentElement.style.setProperty('--activate-foot21',' #ffffffab');
      document.documentElement.style.setProperty('--activate-foot22',' transparent');
      document.documentElement.style.setProperty('--activate-foot30',' transparent');
      document.documentElement.style.setProperty('--activate-foot31',' #ffffffab');
      document.documentElement.style.setProperty('--activate-foot32',' transparent');
      document.documentElement.style.setProperty('--activate-foot40',' transparent');
      document.documentElement.style.setProperty('--activate-foot41',' #ffffffab');
      document.documentElement.style.setProperty('--activate-foot42',' transparent');
      document.documentElement.style.setProperty('--activate-foot50',' #ffffff');
      document.documentElement.style.setProperty('--activate-foot51',' #ffffff');
      document.documentElement.style.setProperty('--activate-foot52',' #ffffff6b');
    }else{
      document.documentElement.style.setProperty('--background-ip-address-perfile','linear-gradient(0deg, #f0f3f7, #ffffff)');
      document.documentElement.style.setProperty('--activate-foot10',' transparent');
      document.documentElement.style.setProperty('--activate-foot11',' #6b6a6b');
      document.documentElement.style.setProperty('--activate-foot20',' transparent');
      document.documentElement.style.setProperty('--activate-foot21',' #6b6a6b');
      document.documentElement.style.setProperty('--activate-foot30',' transparent');
      document.documentElement.style.setProperty('--activate-foot31',' #6b6a6b');
      document.documentElement.style.setProperty('--activate-foot40',' #9259f9');
      document.documentElement.style.setProperty('--activate-foot41',' #9259f9');
    }

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
    this.navController.navigateForward('/' + name, {
      queryParams: {
        previusPagePerfile: true,
      }
    });

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

  sanitizeFileName(fileName:string) {
    const sanitizedText = fileName
      .toLowerCase()
      .replace(/\s+/g, "_")
      .replace(/[^a-z0-9_.-]/g, "");

    return sanitizedText ;
  }
  updateFileImage(file: File,filename :string){
    this.apiService.uploadImagenPerfile(file,filename).subscribe(
      (response) => {
        this.presentCustomToast(response.message,"success")
        this.apiService.uploadImagenPerfileText(response.fileName+"."+ this.nameFile.split('.').pop(),this.dataPerfil[0]).subscribe(
          (res) => {
            this.presentCustomToast(res.message,"success")
          },
          (err) => {
            this.presentCustomToast(err.error.error,"danger");
          }
        );
      },
      (error) => {
        this.presentCustomToast(error.error.error,"danger");
      }
    );
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
        dataUser.FECHANACIMIENTOPERSONA = dataUser.FECHANACIMIENTOPERSONA.split("T")[0];
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
        this.presentCustomToast('No se encontró la sesión', "danger");
        // No se encontró la sesión en el storage
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
uploadImage() {
  this.fileInputRef.nativeElement.click();
}
handleFileInput(event: any) {
  const file = event.target.files[0];

  // Validar el tipo de archivo
  if (!file.type.includes('image/jpeg') && !file.type.includes('image/png')) {
    this.presentCustomToast("La imagen debe ser .png o .jpg", "danger");
    return;
  }

  // Validar el tamaño del archivo
  if (file.size > 2 * 1024 * 1024) {
    this.presentCustomToast("La imagen no puede ser mayor de 2MB","danger");
    return;
  }

  this.selectedFile = file;
  this.nameFile = file.name;
  const reader = new FileReader();
  reader.onload = (e: any) => {
    this.selectedImageUrl = e.target.result;
    if(this.selectedFile){
      this.updateFileImage(this.selectedFile,this.sanitizeFileName(this.dataPerfil[0].NICKNAMEPERSONA)+"."+ this.nameFile.split('.').pop());
    }
  };
  reader.readAsDataURL(file);
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
        this.chanceColorFooter();
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
