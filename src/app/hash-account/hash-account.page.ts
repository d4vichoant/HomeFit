import { Component, OnInit } from '@angular/core';
import { IP_ADDRESS } from '../constantes';
import { NavController, ToastController } from '@ionic/angular';
import { ApiServiceService } from '../api-service.service';
import { FormBuilder, FormControl, FormGroup,Validators } from '@angular/forms';

@Component({
  selector: 'app-hash-account',
  templateUrl: './hash-account.page.html',
  styleUrls: ['./hash-account.page.scss'],
})
export class HashAccountPage implements OnInit {

  public ip_address = IP_ADDRESS;
  public loading = true;

  public showdialogEmail:boolean=true;
  public showdialogPassword:boolean=false;
  public showbuttonList:boolean=true;

  formularioRecoverPassword: FormGroup;

  textUserEmailShow:number=0;
  textUserEmail!:any[];

  HashNumber!:any;

  constructor(private navController: NavController,
    private apiService: ApiServiceService,
    public toastController: ToastController,
    public fb: FormBuilder) {
      this.formularioRecoverPassword = this.fb.group({
        'textUserEmail': new FormControl("",Validators.required),
        'code':new FormControl("",Validators.required),
        'input1value':new FormControl("",Validators.required),
        'input2value':new FormControl("",Validators.required),
        'input3value':new FormControl("",Validators.required),
        'input4value':new FormControl("",Validators.required),
      });
    }

  ngOnInit() {
    this.inicialized();
  }

  ionViewDidEnter(){
    this.inicialized();
  }

  inicialized(){
    this.inicio();
    document.documentElement.style.setProperty('--background-ip-address-hash','url('+IP_ADDRESS+'/media/login/background.jpg)');
    this.loading=false;
  }
  inicio(){
    this.showdialogEmail=true;
    this.showdialogPassword=false;
    this.showbuttonList=true;
    this.textUserEmail=[];
    this.HashNumber=[];
    this.formularioRecoverPassword.reset();
    this.textUserEmailShow=0;
  }

  validateCode(){
    var f= this.formularioRecoverPassword.value;
    var dataCode ={
      textUserEmail:f.textUserEmail,
      input1value:f.input1value,
      input2value:f.input2value,
      input3value:f.input3value,
      input4value:f.input4value,
    }
    const hashCode = dataCode.input1value+dataCode.input2value+dataCode.input3value+dataCode.input4value;
    if(dataCode.input1value!=='' && dataCode.input2value!=='' && dataCode.input3value!=='' && dataCode.input4value){
      this.getValidateHash(hashCode);
    }else{
      this.presentCustomToast('Ingrese un codigo Valido',"success");
    }
  }
  buttonBack(){
    this.showdialogPassword=false;
    this.showdialogEmail=true;
  }

  buttonNext(){
    this.showdialogPassword=true;
    this.showdialogEmail=false;
  }

  go_page(name: string){
    this.navController.navigateForward('/'+name);
  }
  onInputCompleted() {
    var f= this.formularioRecoverPassword.value;
    var dataLogin ={
      textUserEmail:f.textUserEmail
    }
    if(dataLogin.textUserEmail!==''){
      this.getMailUsuario(dataLogin.textUserEmail);
    }
  }
  onInputChange(event: any) {
    const input = event.target as HTMLInputElement;
    let inputValue = input.value;

    if (inputValue.length > 1) {
      inputValue = inputValue.slice(0, 1);
      input.value = inputValue;
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

    getMailUsuario(usuario:string){
      this.apiService.getMailUsuario(usuario).subscribe(
        (response) => {
          this.textUserEmail=response;
          if(this.textUserEmail && this.textUserEmail.length>0){
            this.textUserEmailShow=1;
          }else{
            this.textUserEmailShow=2;
          }
          this.getgenerarHash();
        },
        (error) => {
          this.textUserEmailShow=2;

          this.presentCustomToast(error.error.error,"danger");
        }
      );
    }

  getgenerarHash(){
    this.apiService.getgenerarHash(this.textUserEmail[0].IDPERSONA).subscribe(
      (response) => {
        this.HashNumber=response.hash;
      },
      (error) => {
        this.presentCustomToast(error.error.error,"danger");
      }
    );
  }
  getValidateHash(hashNumber:string){
    this.apiService.getValidateHash(this.textUserEmail[0].IDPERSONA,hashNumber).subscribe(
      (response) => {
        if(response){
          this.navController.navigateRoot('/change-password', {
            queryParams: {
              variableRecuperarPassword: this.textUserEmail,
            },
          });
          this.inicio();
        }else{
          this.presentCustomToast("Código Incorrecto","danger");
        }
      },
      (error) => {
        this.presentCustomToast(error.error.error,"danger");
      }
    );
  }
  recuperarContrasenia(){
    this.loading=true;
    this.showdialogEmail=false;
    this.showdialogPassword=false;
    const data={
      correoUsuario:this.textUserEmail[0].CORREOPERSONA,
      hashValidate:this.HashNumber,
    }
    this.apiService.recuperarContrasenia(data).subscribe(
      (response) => {
        this.presentCustomToast(response,"success");
        this.loading=false;
        this.showdialogPassword=true;
        this.showbuttonList=!this.showbuttonList;
      },
      (error) => {
        this.presentCustomToast(error.error.error,"danger");
      }
    );
  }
}
