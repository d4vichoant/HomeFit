import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import SwiperCore, {Pagination, Swiper} from 'swiper';
import {StatusBar} from "@capacitor/status-bar";
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';

import { NavController } from '@ionic/angular';

import { IP_ADDRESS } from '../constantes';

SwiperCore.use([Pagination]);


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  public loading = true;
  public ip_address = IP_ADDRESS;
  public  onboardSlides = [
    {
      title:'Bienvenido a Home Fit Go',
      description: 'Nuestra aplicación te brinda una experiencia de entrenamiento en casa como ninguna otra.',
      image: 'image1'
    },
    {
      title:'Entrenamiento personalizado',
      description: 'Nuestros entrenadores personales virtuales te guían a través de rutinas de entrenamiento personalizadas para satisfacer tus necesidades y objetivos de fitness específicos.',
      image: 'image2'
    },
    {
      title:'Acceso a cualquier hora y en cualquier lugar',
      description: 'Puedes entrenar en casa, en el parque o en cualquier otro lugar que desees.',
      image: 'image3'
    },
    {
      title:'Comunidad',
      description: ' Nuestra comunidad es un lugar donde puedes encontrar inspiración, motivación y apoyo para ayudarte a alcanzar tus objetivos de fitness',
      image: 'image4'
    },
  ];

  swiperOptions = {
    pagination: true,
  };

  constructor(
    private router : Router,
    private navController: NavController,
    private platform: Platform
  ) {}
  ngOnInit(){
    if (this.platform.is('android')) {
      // Habilita la rotación en la página actual
      window.addEventListener('orientationchange', this.handleOrientationChange);
    }
   }

   private handleOrientationChange = () => {
    const orientation = window.screen.orientation.type;

    // Verifica si la orientación actual es horizontal
    if (orientation === 'landscape-primary' || orientation === 'landscape-secondary') {
      // Bloquear la orientación en horizontal
      this.lockScreenOrientation('portrait');
    }
  };

  private lockScreenOrientation(orientation: 'portrait' | 'landscape' | 'portrait-primary' | 'portrait-secondary' | 'landscape-primary' | 'landscape-secondary') {
    // Bloquear la orientación de la pantalla
    if (screen.orientation && screen.orientation.lock) {
      screen.orientation.lock(orientation);
    }
  }

 @ViewChild('swiper')
 swiperRef:ElementRef | undefined;
 swiper?: Swiper;


  swiperSlideChanged(e: any){
  }
  swiperReady(){
    this.swiper=this.swiperRef?.nativeElement.swiper;
  }
  public goBack(){
    this.swiper?.slidePrev();
  }
  public goNext(){
    this.swiper?.slideNext();
  }

  public skipBtn(){
    this.navController.navigateForward('/login');
    //this.router.navigate(['/login'])
  }
  public go_nextPage(){
    this.navController.navigateForward(['/select']);
  }
  ionViewDidEnter() {
    this.onboardSlides;
    StatusBar.hide();
    StatusBar.setOverlaysWebView({overlay:true})
    StatusBar.setBackgroundColor({color:'#ffffff'})
    const images = ['image1', 'image2', 'image3', 'image4'];
    const promises = images.map((image) => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = resolve;
        img.onerror = reject;
        img.src =  IP_ADDRESS+`/media/welcome/${image}.png`;
      });
    });

    Promise.all(promises).then(() => {
      this.loading = false;
    }).catch((error) => {
      console.error('Error al cargar las imágenes:', error);
    });
  }
}
