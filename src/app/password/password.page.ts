import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';

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

  constructor(private navController: NavController, public fb: FormBuilder)
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


  ngOnInit() {
  }
  goHome(){
    this.navController.navigateForward('/home');
  }
  public goBack(){
    this.navController.navigateForward(['/profile-basic']);
  }
  ionViewDidEnter() {
    this.loading = false
  }
  go_nextPage(){
    var profiledat = JSON.parse(localStorage.getItem('profilesdates')!);
    var f= this.formularioLogin.value;
    profiledat.password = f.password;
    localStorage.setItem('profilesdates', JSON.stringify(profiledat));
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
}
