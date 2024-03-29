import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NavController, ToastController } from '@ionic/angular';

import { Keyboard } from '@capacitor/keyboard';
interface ValidationStatus {
  symbol: boolean;
  uppercase: boolean;
  number: boolean;
  length: boolean;
}

@Component({
  selector: 'app-password',
  templateUrl: './password.page.html',
  styleUrls: ['./password.page.scss'],
})
export class PasswordPage implements OnInit {
  public loading = true;
  formularioLogin: FormGroup;
  passwordType: string = 'password';
  passwordIcon: string = 'eye-outline';

  passwordTypeCnf: string = 'password';
  passwordIconConf: string = 'eye-outline';


  validationStatus: ValidationStatus = {
    length: false,
    uppercase: false,
    number: false,
    symbol: false
  };

  constructor(private navController: NavController, public fb: FormBuilder, public toastController: ToastController,)
  {
    this.formularioLogin = this.fb.group({
      'password': new FormControl("",Validators.required),
      'passwordConfirm':new FormControl("",Validators.required)
    });
    this.formularioLogin = this.fb.group({
      password: ['', Validators.compose([
        Validators.required,
        Validators.minLength(8),
        Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])')
      ])],
      passwordConfirm: ['', Validators.required]
    },{ validator: this.passwordMatchValidator });


    // Escucha los cambios en el campo de contraseña
    this.formularioLogin.get('password')?.valueChanges.subscribe(value => {
      // Validar la longitud mínima
      this.validationStatus.length = value.length >= 8;

      // Validar si contiene al menos una mayúscula
      this.validationStatus.uppercase = /[A-Z]/.test(value);

      // Validar si contiene al menos un número
      this.validationStatus.number = /[0-9]/.test(value);

      // Validar si contiene al menos un carácter especial
      this.validationStatus.symbol = /[!@#$%^&*]/.test(value);
    });
   }


   hideshowkeyboard(){

    Keyboard.addListener('keyboardWillShow', (info) => {
      const keyboardHeight = info.keyboardHeight; // Altura del teclado
      const buttonsDiv = document.querySelector('.container-button') as HTMLElement;
      buttonsDiv.style.bottom = `-${keyboardHeight}px`; // Mover el elemento hacia arriba
    });

    // Escuchar el evento de cuando el teclado se oculta
    Keyboard.addListener('keyboardWillHide', () => {
      const buttonsDiv = document.querySelector('.container-button') as HTMLElement;
      buttonsDiv.style.bottom = '0'; // Restaurar la posición original del elemento
    });

  }

  ngOnInit() {
    this.hideshowkeyboard();
  }
  goHome(){
    this.navController.navigateForward('/home');
  }
  public goBack(){
    this.navController.navigateForward(['/profile-basic']);
  }
  ionViewDidEnter() {
    this.hideshowkeyboard();
    if (JSON.parse(localStorage.getItem('profilesdates')!)!=null){
    this.loading = false
    }else{
      localStorage.removeItem('profilesdates');
      this.navController.navigateForward('/errorpage');
    }
  }
  go_nextPage(){
    this.passwordEncode();
    this.navController.navigateForward(['gender']);

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
  togglePasswordConf() {
    if (this.passwordTypeCnf === 'password') {
      this.passwordTypeCnf = 'text';
      this.passwordIconConf = 'eye-off-outline';
    } else {
      this.passwordTypeCnf = 'password';
      this.passwordIconConf = 'eye-outline';
    }
  }
  passwordEncode() {
    var profiledat = JSON.parse(localStorage.getItem('profilesdates')!);
    var f = this.formularioLogin.value;
    let password = f.password;
    const encoder = new TextEncoder();
    const data = encoder.encode(password);

    window.crypto.subtle.digest('SHA-256', data)
      .then(hashBuffer => {
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashedPassword = hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');
        profiledat.password = hashedPassword;
        localStorage.setItem('profilesdates', JSON.stringify(profiledat));
      })
      .catch(error => {
        this.presentCustomToast('Error al guardar la contraseña', "danger");
      });
  }


  passwordMatchValidator(control: FormGroup): { [key: string]: boolean } | null {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('passwordConfirm')?.value;

    if (password === confirmPassword && // Verificar igualdad de contraseñas
    password.length >= 8 && // Verificar longitud mínima
    /[A-Z]/.test(password) && // Verificar al menos una mayúscula
    /[0-9]/.test(password) && // Verificar al menos un número
    /[!@#$%^&*]/.test(password) // Verificar al menos un carácter especial
    ) {
      control.get('passwordConfirm')?.setErrors(null);
      return null;
    } else {
      return { mismatch: true };
    }
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
