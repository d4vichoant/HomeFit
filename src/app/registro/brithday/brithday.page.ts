
import {  Component,  OnInit,   } from '@angular/core';
import { StatusBar } from '@capacitor/status-bar';
import { NavController, ToastController} from '@ionic/angular';
import SwiperCore, { Pagination } from 'swiper';
import { ChangeDetectorRef } from '@angular/core';

import { IP_ADDRESS } from '../../constantes';

SwiperCore.use([Pagination]);

@Component({
  selector: 'app-brithday',
  templateUrl: './brithday.page.html',
  styleUrls: ['./brithday.page.scss'],
})
export class BrithdayPage implements OnInit  {
  public loading = true;
  days : string[] = [];
  months: string[] = [];
  years: string[] = [];
  monthSelected! :number;
  yearSelected! : number;
  daySelected!:number;
  constructor(
    private navController: NavController,
    private changeDetectorRef: ChangeDetectorRef,
    public toastController: ToastController
  ) {
    this.months = this.allMonths();
    this.days = this.alldays();
    this.years = this.allYears();
  }

  ngOnInit() {

  }
  goHome(){
    this.navController.navigateBack('/home');
  }
  goBack(){
    this.navController.navigateBack('/gender');
  }
  go_nextPage(){
    //this.navController.navigateBack('/w-and-h');
    if (this.daySelected !=null && this.monthSelected !=null && this.yearSelected !=null ){
      if (this.validateDate(this.daySelected,this.monthSelected,this.yearSelected)){
        var profiledat = JSON.parse(localStorage.getItem('profilesdates')!);
        profiledat.birthday = this.yearSelected+"-"+this.monthSelected+"-"+this.daySelected;
        localStorage.setItem('profilesdates', JSON.stringify(profiledat));
        const storedData = localStorage.getItem('profilesdates');
        if (storedData) {
          const parsedData = JSON.parse(storedData);
          if (parsedData.rolusuario ==1)
          this.navController.navigateBack('/w-and-h');
          else
          this.navController.navigateBack('/specialty');
        }
      }else{
        this.presentCustomToast("La fecha Ingresada es incorrecta","danger");
      }
    }else{
      this.presentCustomToast("Llene todos los campos","danger");
    }
  }
  ngAfterViewInit() {

  }
  ionViewDidEnter() {
    StatusBar.hide();
    StatusBar.setOverlaysWebView({overlay:true});
    StatusBar.setBackgroundColor({color:'#ffffff'});
    if (JSON.parse(localStorage.getItem('profilesdates')!)!=null){
    document.documentElement.style.setProperty('--background-ip-address','url('+IP_ADDRESS+'/media/brithday/background1.jpg)');

     const image = new Image();
     image.src = IP_ADDRESS+'/media/brithday/background1.jpg';
     image.onload = () => {
      this.months=this.allMonths();
      this.days = this.alldays();
      this.years = this.allYears();
       this.loading = false;
     };
    }else{
      localStorage.removeItem('profilesdates');
      this.navController.navigateForward('/errorpage');
    }
  }

  alldays(): string[] {
    const days: string[] = [];
    days.push("Dia");
    for (let index = 1; index <= 31; index++) {
      days.push(index+"");
    }
    return days;
  }
  allMonths():string[]{
    return ['Mes','Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  }
  allYears():string[]{
    const years: string[] = [];
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    years.push("Año");
    for (let index = currentYear; index >= currentYear-100; index--) {
      years.push(index+"");
    }
    return years;
  }
  onSwiperDays(event: any) {
    const swiper = event.target.swiper;
    this.daySelected =  parseInt( swiper.activeIndex);
  }
  onSwiperMonths(event: any) {
    const swiper = event.target.swiper;
    this.monthSelected =  parseInt( swiper.activeIndex);
  }
  onSwiperYears(event: any) {
    const swiper = event.target.swiper;
    const activeIndex = parseInt(swiper.activeIndex);
    this.yearSelected = parseInt(this.years[activeIndex]);
  }
  validateDate(day: number, month: number, year: number): boolean {
    const date = new Date(year, month - 1, day);
    return (
      date.getDate() === day &&
      date.getMonth() === month - 1 &&
      date.getFullYear() === year
    );
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

}
