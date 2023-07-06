import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';


import { IP_ADDRESS } from '../../../constantes';
import { StatusBar } from '@capacitor/status-bar';

@Component({
  selector: 'app-tariff',
  templateUrl: './tariff.page.html',
  styleUrls: ['./tariff.page.scss'],
})
export class TariffPage implements OnInit {
  public loading = true;
  public ip_address = IP_ADDRESS;

  numeroIngresado: string='0.99' ;
  suscripciones = [
    {
      titulo: 'Suscripción',
      subtitulo: 'Básica',
      precio: '',
      imagen: this.ip_address+'/media/tariff/icon1.png',
      detalles: '1 mes',
      colorbackground:'#f6f3ff',
    },
    {
      titulo: 'Suscripción',
      subtitulo: 'Premium',
      precio: '',
      imagen: this.ip_address+'/media/tariff/icon2.png',
      detalles: '3 meses',
      colorbackground:'#f1edfe',
    },
    {
      titulo: 'Suscripción',
      subtitulo: 'Pro',
      precio: '',
      imagen: this.ip_address+'/media/tariff/icon3.png',
      detalles: '6 meses',
      colorbackground:'#f1edfe',
    },
    {
      titulo: 'Suscripción',
      subtitulo: 'Golden',
      precio: '',
      imagen: this.ip_address+'/media/tariff/icon4.png',
      detalles: '12 meses',
      colorbackground:'#f6f3ff',
    },
  ];

  constructor(private navController: NavController) {
    this.actualizarNumero();
  }

  ngOnInit() {
    //this.loading = false;
  }
  goHome(){
    this.navController.navigateForward('/home');
  }
  public goBack(){
    this.navController.navigateForward('/additional');
  }
  public go_nextPage(){
    var profiledat = JSON.parse(localStorage.getItem('profilesdates')!);
    profiledat.tarifa = this.numeroIngresado;
    localStorage.setItem('profilesdates', JSON.stringify(profiledat));
    this.navController.navigateForward('/resume');
  }
  ionViewDidEnter() {
    StatusBar.hide();
    StatusBar.setOverlaysWebView({overlay:true});
    StatusBar.setBackgroundColor({color:'#ffffff'});
    if (JSON.parse(localStorage.getItem('profilesdates')!)!=null){

    document.documentElement.style.setProperty('--background-ip-address','url('+IP_ADDRESS+'/media/tariff/backgroundtariff.jpg)');

    const image = new Image();
    image.src = IP_ADDRESS+'/media/tariff/backgroundtariff.jpg';
    image.onload = () => {
      this.loading = false;
    };
    }else{
      localStorage.removeItem('profilesdates');
      this.navController.navigateForward('/errorpage');
    }
  }
  actualizarNumero() {
      this.numeroIngresado = parseFloat(this.numeroIngresado).toFixed(2)+"";
      this.suscripciones[0].precio = '$ ' + this.numeroIngresado + ' USD';
      this.suscripciones[1].precio = '$ ' + (parseFloat(this.numeroIngresado)*3 - (parseFloat(this.numeroIngresado)*3) * (17 / 100)).toFixed(2) + ' USD';
      this.suscripciones[2].precio = '$ ' + (parseFloat(this.numeroIngresado)*6 - (parseFloat(this.numeroIngresado)*6) * (25 / 100)).toFixed(2) + ' USD';
      this.suscripciones[3].precio = '$ ' + (parseFloat(this.numeroIngresado)*12 - (parseFloat(this.numeroIngresado)*12) * (33 / 100)).toFixed(2) + ' USD';
  }
}
