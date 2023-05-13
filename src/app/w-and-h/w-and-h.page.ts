import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { StatusBar } from '@capacitor/status-bar';
import { NavController } from '@ionic/angular';
import PerfectScrollbar from 'perfect-scrollbar';

import { IP_ADDRESS } from '../constantes';

@Component({
  selector: 'app-w-and-h',
  templateUrl: './w-and-h.page.html',
  styleUrls: ['./w-and-h.page.scss'],
})
export class WAndHPage implements OnInit {
  public loading = true;
  metro: string[]= [];
  @ViewChild('wheelListH') wheelListH!: ElementRef;
  @ViewChild('wheelListW') wheelListW!: ElementRef;
  textShowH!: number ;
  textShowW!: number ;

  textShowWInLbs!: number; // Valor en libras
  showInLbs!: boolean;

  isMeters: boolean = true;
  valueInMeters: number = 10;
  textShowHInFt!: string;

  constructor(private navController: NavController) {

   }

  ngAfterViewInit() {
    const containerH = this.wheelListH.nativeElement;
    const psH = new PerfectScrollbar(containerH);
    psH.update();

    const containerW = this.wheelListW.nativeElement;
    const psW = new PerfectScrollbar(containerW);
    psW.update();
  }

  ngOnInit() {
  }
  goHome(){
    this.navController.navigateBack('/home');
  }
  goBack(){
    this.navController.navigateBack('/brithday');
  }
  go_nextPage(){
    var profiledat = JSON.parse(localStorage.getItem('profilesdates')!);
    profiledat.peso = this.textShowW+"";
    profiledat.altura = this.textShowH+"";
    localStorage.setItem('profilesdates', JSON.stringify(profiledat));
    this.navController.navigateBack('/exercise-frequency');
  }
  ionViewDidEnter() {
    StatusBar.hide();
    StatusBar.setOverlaysWebView({overlay:true});
    StatusBar.setBackgroundColor({color:'#ffffff'});

    document.documentElement.style.setProperty('--background-ip-address','url('+IP_ADDRESS+'/media/w-h/background_w-h.jpg)');

    this.metro = this.medida();
    let imagesLoaded = 0;
    const image1 = new Image();
    image1.src = IP_ADDRESS+'/media/w-h/background_w-h.jpg';

    this.textShowH = 0.01;
    this.textShowW = 2.5;

    const handleImageLoad = () => {
      imagesLoaded++;
      if (imagesLoaded === 1) {
        this.loading = false;
      }
    };

    image1.onload = handleImageLoad;
  }
  medida(): string[] {
    let index: string[]=[];

    for (let i = 0; i < 50; i++) {
      index.push("──");
      for (let j = 0; j < 4; j++) {
        index.push("─");
      }
    }
    return index;
  }
  handleScrollH(event: any) {
    const scrollTop = event.target.scrollTop; // Desplazamiento vertical
    const totalHeight = event.target.scrollHeight - event.target.clientHeight; // Altura total del contenido
    const percentage = (scrollTop / totalHeight) * 100; // Porcentaje de desplazamiento

    const value =  Math.max(1, Math.round(percentage * 100) / 100);// Valor numérico
    this.textShowH = parseFloat( (0.023 * value).toFixed(2));
    const feet = Math.floor(this.textShowH * 3.28084);
    const inches = Math.round((this.textShowH * 3.28084 - feet) * 12);
    this.textShowHInFt = feet +  "'" + inches + '"';
  }
  handleScrollW(event: any) {
    const scrollTop = event.target.scrollTop; // Desplazamiento vertical
    const totalHeight = event.target.scrollHeight - event.target.clientHeight; // Altura total del contenido
    const percentage = (scrollTop / totalHeight) * 100; //. Porcentaje de desplazamiento

    const value =  Math.max(1, Math.round(percentage * 100) / 100);
    this.textShowW =  parseFloat( (2.5 * value).toFixed(0));
    this.textShowWInLbs = parseFloat( (this.textShowW * 2.20462).toFixed(1));
  }
  convertUnits() {
    if (this.showInLbs) {
      this.textShowWInLbs = 0;
    } else {
      this.textShowWInLbs = parseFloat( (this.textShowW * 2.20462).toFixed(1));
    }

    this.showInLbs = !this.showInLbs;
  }
  toggleUnit() {
    this.isMeters = !this.isMeters;
    this.updateText();
  }
  updateText() {
    if (this.isMeters) {
      this.textShowHInFt = 0+"";
    } else {
      // Convertir a pies/pulgadas
      const feet = Math.floor(this.textShowH * 3.28084);
      const inches = Math.round((this.textShowH * 3.28084 - feet) * 12);
      this.textShowHInFt = feet +  "'" + inches + '"';
    }
  }
}
