import { Component, OnInit } from '@angular/core';
import { StatusBar } from '@capacitor/status-bar';
import { AlertController, NavController, ToastController } from '@ionic/angular';

import { IP_ADDRESS } from '../../../constantes';

@Component({
  selector: 'app-additional',
  templateUrl: './additional.page.html',
  styleUrls: ['./additional.page.scss'],
})
export class AdditionalPage implements OnInit {
  public loading = true;
  experienciaSeleccionada!: string;
  opcionSeleccionada: string = 'no';

  showForm: boolean = false;
  nombre: string = '';
  certificador: string = '';
  horas: string = '';
  certifications: any[] = [];

  texto!: string;
  palabrasRestantes!: number;
  constructor(private navController: NavController,
    private alertController: AlertController,
    public toastController: ToastController) { }

  ngOnInit() {
    this.palabrasRestantes = 400;
  }

  ionViewDidEnter() {
    StatusBar.hide();
    StatusBar.setOverlaysWebView({overlay:true});
    StatusBar.setBackgroundColor({color:'#ffffff'});
    if (JSON.parse(localStorage.getItem('profilesdates')!)!=null){
    document.documentElement.style.setProperty('--background-ip-address','url('+IP_ADDRESS+'/media/additional/backgroundadditional.jpg)');

    const image = new Image();
    image.src = IP_ADDRESS+'/media/additional/backgroundadditional.jpg';
    image.onload = () => {
      this.loading = false;
    };
    }else{
      localStorage.removeItem('profilesdates');
      this.navController.navigateForward('/errorpage');
    }
  }
  goHome(){
    this.navController.navigateForward('/home');
  }
  public goBack(){
    this.navController.navigateForward('/specialty');
  }
  go_nextPage(){
    var profiledat = JSON.parse(localStorage.getItem('profilesdates')!);
    if (!this.experienciaSeleccionada || !this.texto){
      this.presentCustomToast("Debe llenar todos los campos","danger");
    }else{
      if(this.opcionSeleccionada=="no"){
        profiledat.certificación=null;
        profiledat.experiencia=this.experienciaSeleccionada;
        profiledat.about = this.texto;
        localStorage.setItem('profilesdates', JSON.stringify(profiledat));
        this.navController.navigateForward('/tariff');
      }else{
        if (this.certifications.length==0){
          this.presentCustomToast("Ingrese las certificaciones","danger");
        }else{
          profiledat.certificacion=this.certifications;
          profiledat.experiencia=this.experienciaSeleccionada;
          profiledat.about = this.texto;
          localStorage.setItem('profilesdates', JSON.stringify(profiledat));
          this.navController.navigateForward('/tariff');
        }
      }
    }
  }

  saveCertification() {
    const certification = {
      nombre: this.nombre,
      certificador: this.certificador,
      horas: this.horas
    };
    this.certifications.push(certification);
    this.nombre = '';
    this.certificador = '';
    this.horas = '';
  }

  async deleteCertification(certification: any) {
    const alert = await this.alertController.create({
      header: 'Confirmar eliminación',
      message: '¿Estás seguro de que deseas eliminar esta certificación?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            this.presentCustomToast("Eliminación cancelada","danger");
          }
        },
        {
          text: 'Eliminar',
          handler: () => {
            const index = this.certifications.indexOf(certification);
            if (index !== -1) {
              this.certifications.splice(index, 1);
              this.presentCustomToast("Certificación eliminada","success");
            }
          }
        }
      ]
    });

    await alert.present();
  }

  async openCertificationAlert() {
    const alert = await this.alertController.create({
      header: 'Nueva Certificación',
      inputs: [
        {
          name: 'nombre',
          type: 'text',
          placeholder: 'Nombre del certificado'
        },
        {
          name: 'certificador',
          type: 'text',
          placeholder: 'Quién lo certificó'
        },
        {
          name: 'horas',
          type: 'number',
          placeholder: 'Horas en total'
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Guardar',
          handler: (data: any) => {
            if (data.nombre && data.certificador && data.horas) {
              const certification = {
                nombre: data.nombre,
                certificador: data.certificador,
                horas: data.horas,
              };
              this.certifications.push(certification);
              return true;
            } else {
              this.presentCustomToast( "Por favor, completa todos los campos","danger");
              return false;
            }
          }
        }
      ]
    });

    await alert.present();
  }

  async editCertification(certification: any) {
    const alert = await this.alertController.create({
      header: 'Editar Certificación',
      inputs: [
        {
          name: 'nombre',
          type: 'text',
          value: certification.nombre
        },
        {
          name: 'certificador',
          type: 'text',
          value: certification.certificador
        },
        {
          name: 'horas',
          type: 'number',
          value: certification.horas.toString()
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Actualizar',
          handler: (data: any) => {
            if (data.nombre && data.certificador && data.horas) {
            certification.nombre = data.nombre;
            certification.certificador = data.certificador;
            certification.horas = data.horas;
            return true;
            }else{
              this.presentCustomToast( "Por favor, completa todos los campos","danger");
              return false;
            }
          }
        }
      ]
    });

    await alert.present();
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

    contarPalabras() {
      const palabras = this.texto ? this.texto.trim().split(/\s+/) : [];
      this.palabrasRestantes = 400 - palabras.length;
      if (this.palabrasRestantes < 0) {
        this.texto = this.texto.trim().split(/\s+/).slice(0, 400).join(' ');
        this.palabrasRestantes = 0;
      }
    }
}
