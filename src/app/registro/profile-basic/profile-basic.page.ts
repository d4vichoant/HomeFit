import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { StatusBar } from '@capacitor/status-bar';
import { NavController, ToastController } from '@ionic/angular';

import { ApiServiceService } from '../../api-service.service';

import { IP_ADDRESS } from '../../constantes';

@Component({
  selector: 'app-profile-basic',
  templateUrl: './profile-basic.page.html',
  styleUrls: ['./profile-basic.page.scss'],
})
export class ProfileBasicPage implements OnInit {
  public loading = true;
  formularioProfileBasic: FormGroup;
  continueBtnDisabled = true;
  validateUsuario = false;
  validateCorreo=false;
  index=0;
  myVariableChangedTime=new Date();

  constructor(public fb: FormBuilder,
    private navController: NavController,
    private apiService: ApiServiceService,
    public toastController: ToastController ) {
      this.formularioProfileBasic = this.fb.group({
        'nickname': new FormControl("",Validators.required),
        'first_name':new FormControl("",Validators.required),
        'last_name':new FormControl("",Validators.required),
        'mail_profile':new FormControl("",Validators.required)
      });
     }

  ngOnInit() {
    StatusBar.hide();
    StatusBar.setOverlaysWebView({overlay:true})
    StatusBar.setBackgroundColor({color:'#ffffff'})
    document.documentElement.style.setProperty('--background-ip-address','url('+ IP_ADDRESS+'/media/profile-basic/backgroundprofile-basic.jpg)');
  }


  ionViewDidEnter() {
    if (JSON.parse(localStorage.getItem('profilesdates')!)!=null){
      let imagesLoaded = 0;
      const image1 = new Image();
      image1.src =  IP_ADDRESS+'/media/profile-basic/backgroundprofile-basic.jpg';
      const handleImageLoad = () => {
        imagesLoaded++;
        if (imagesLoaded === 1) {
          this.loading = false;
        }
      };
      image1.onload = handleImageLoad;
    }else{
      localStorage.removeItem('profilesdates');
      this.navController.navigateForward('/errorpage');
    }

  }
  goHome(){
    this.navController.navigateForward('/home');
  }
  public goBack(){
    this.navController.navigateForward(['/select'])
  }
  go_nextPage(){
    this.verificateInputs();
    var f= this.formularioProfileBasic.value;
    var profiledat = JSON.parse(localStorage.getItem('profilesdates')!);
    profiledat.nickname=f.nickname;
    profiledat.first_name= f.first_name;
    profiledat.last_name=f.last_name;
    profiledat.mail_profile = f.mail_profile;
    localStorage.setItem('profilesdates', JSON.stringify(profiledat));
    this.navController.navigateForward(['/password']);

  }

  private verificateInputs(): void{
    const values = this.formularioProfileBasic.value;
    if (values.nickname && values.first_name && values.last_name && values.mail_profile && this.validateCorreo && this.validateUsuario) {
      this.continueBtnDisabled = false;
    }else{
      this.continueBtnDisabled = true;
    }
  }

  showLabel(controlName: string) {
    const input = document.querySelector(`ion-input[formControlName="${controlName}"]`);
    if (input && input.parentElement) {
      const label = input.parentElement.querySelector(`ion-label`);
      if (label) {
        label.classList.add('show');
      }
    }
  }

  hideLabel(controlName: string) {
    const input = document.querySelector(`ion-input[formControlName="${controlName}"]`);
    if (input && input.parentElement) {
      const label = input.parentElement.querySelector(`ion-label`);
      if (label) {
        label.classList.remove('show');
      }
    }
  }
  async checkNickname() {
    var f = this.formularioProfileBasic.value;
    const input = document.querySelector(`ion-input[formControlName="nickname"]`);
    const icon = input?.parentElement?.querySelector(`ion-icon`);

    this.apiService.checkNickname(f.nickname).subscribe(
      (response) => {
        const isAvailable = response.available;
        if (isAvailable) {
          this.validateUsuario = true;
          this.presentCustomToast('Usuario disponible', 'success');
          icon?.classList.remove('show');
        } else {
          this.presentCustomToast('Usuario No disponible', 'danger');
          icon?.classList.add('show');
        }

        this.verificateInputs(); // Mover la llamada aquí
      },
      (error) => {
        const errorMessage = error?.error?.message || 'Error desconocido';
        this.presentCustomToast(errorMessage, 'danger');
        this.verificateInputs(); // También mover la llamada aquí en caso de error
      }
    );
  }

  async checkMail() {
    var f= this.formularioProfileBasic.value;
    const input = document.querySelector(`ion-input[formControlName="mail_profile"]`);
    const icon = input?.parentElement?.querySelector(`ion-icon`);
    this.validateCorreo=false;
    this.apiService.checkMail(f.mail_profile).subscribe(
      (response) => {
        const isAvailable = response.available;
        if (isAvailable) {
            if (this.validarCorreoElectronico(f.mail_profile)){
              this.presentCustomToast('Correo disponible', 'success');
              this.validateCorreo=true;
              icon?.classList.remove('show');
            }else{
              this.presentCustomToast('Correo No disponible', 'danger');
              icon?.classList.add('show');
            }
        } else {
          this.presentCustomToast('Correo No disponible', 'danger');
          icon?.classList.add('show');
        }
        this.verificateInputs();
      },
      (error) => {
        const errorMessage = error?.error?.message || 'Error desconocido';
        this.presentCustomToast(errorMessage, "danger");
      }
    );
  }

  private validarCorreoElectronico(email: string): boolean {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email.trim());
  }

  clearNickname(controlName: string) {
    const nicknameControl = this.formularioProfileBasic?.get(controlName);
    if (nicknameControl) {
      const input = document.querySelector(`ion-input[formControlName="${controlName}"]`)
      if (input && input.parentElement) {
        const icon = input.parentElement.querySelector(`ion-icon`);
        if (icon) {
          icon.classList.remove('show');
          nicknameControl.setValue('');
        }
      }
    }
  }

  changerlastSecIndex(){
    if (this.index!=0){
      const now = new Date();
      if ( Math.abs(now.getTime() - this.myVariableChangedTime.getTime())<1000) {
        this.index=this.index + 1;
        this.myVariableChangedTime=new Date();
      }else{
        this.index=0;
        this.myVariableChangedTime=new Date();
      }
    }else{
      this.index=1;
      this.myVariableChangedTime=new Date();
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
    alertElement.style.setProperty('--alert-top', `calc(50% + (9% * ${this.index}) + 8%)`);
    toast.present();
    this.changerlastSecIndex();
  }

  get_into_with_facebook(){

  }
  get_into_with_google(){}
}

