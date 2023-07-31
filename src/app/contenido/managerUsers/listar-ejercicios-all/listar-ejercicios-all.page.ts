import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { InfiniteScrollCustomEvent } from '@ionic/angular';
import { NavController, ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { IP_ADDRESS } from '../../../constantes';
import { ApiServiceService } from '../../../api-service.service'
import { StatusBar, StatusBarStyle } from '@capacitor/status-bar';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-listar-ejercicios-all',
  templateUrl: './listar-ejercicios-all.page.html',
  styleUrls: ['./listar-ejercicios-all.page.scss'],
})
export class ListarEjerciciosAllPage implements OnInit {
  @ViewChild('videoPlayer') videoPlayer!: ElementRef;
  public isPlaying = true;

  public ip_address = IP_ADDRESS;
  public userSesion!:string;
  public userSesionPerfil!:any;

  public loading = true;

  dataEjercicio!:any[];
  dataEjercicioParcial!:any[];
  dataEjercicioOrig!:any[];


  bookmarkState: { [key: number]: boolean } = {};
  dataBookMark!:any[];

  dividendo:number=5;

  public searchTerm:string="";
  private previousSearchTerm: string = '';

  dataEntrenadorUsuarios!:any[];

  touchTimeout: any;

  showsearchbox:boolean=false;

  previusPagecontratoEntrenador:boolean=false;
  constructor(
    private route: ActivatedRoute,
    private navController: NavController,
    private apiService: ApiServiceService,
    private storage: Storage,
    public toastController: ToastController
  ) { }


  ngOnInit() {
    this.recuperarDatos();
    this.validateSesion();
  }
  ionViewDidEnter() {
    this.recuperarDatos();
    this.validateSesion();
  }

  recuperarDatos(){
    this.route.queryParams.subscribe(params => {
      this.previusPagecontratoEntrenador = params['previusPagecontratoEntrenador'] as any;
    });
  }

  async validateSesion() {
    try {
      const sesion = await this.storage.get('sesion');
      if (sesion && JSON.parse(sesion).rolUsuario == 1) {
        this.userSesion = JSON.parse(sesion).nickname;
        this.obtenerGetPerfilCompleto(this.userSesion);
        const response =
        await this.apiService.protectedRequestWithToken(JSON.parse(sesion).token).toPromise();
        this.obtenerBookMarkUser();
        this.obtenerContratoEntrenadoresUsuario();
        this.StatusBar();
        this.loading = false;
      } else {
        this.handleError();
      }
    } catch (error) {
      this.handleError();
    }
  }

  private handleError() {
    this.loading = false;
    this.navController.navigateForward('/error-users');
    this.storage.remove('sesion');
  }

  StatusBar(){
    StatusBar.setOverlaysWebView({ overlay: true });
    StatusBar.setBackgroundColor({color:'transparent'});
    StatusBar.setStyle({ style: StatusBarStyle.Dark });
  }

  cargarImagenesBefores(){
    const Ejercicios = this.dataEjercicio;
    const imageUrls = [];
    if (Array.isArray(Ejercicios)) {
      for (let i = 0; i < Ejercicios.length; i++) {
        const nameImagen = this.getVideoName(Ejercicios[i].ALMACENAMIENTOMULTIMEDIA)+'.jpg';
        const imageUrl = this.ip_address+'/multimedia/'+nameImagen;
        imageUrls.push(imageUrl);
      }
    }

    let imagesLoaded = 0;
    const totalImages = imageUrls.length;
    const handleImageLoad = () => {
      imagesLoaded++;
      if (imagesLoaded === totalImages) {
        this.loading = false;
      }
    };
    imageUrls.forEach((imageUrl) => {
      const image = new Image();
      image.onload = handleImageLoad;
      image.src = imageUrl;
    });
  }

  getVideoName(url: string): string {
    return url.split('.')[0];
  }

  onIonInfinite(ev:any) {
    if(this.dataEjercicioParcial<this.dataEjercicio){
      this.llenarMasDatos();
      setTimeout(() => {
        (ev as InfiniteScrollCustomEvent).target.complete();
      }, 1000);
    }else{
      this.presentCustomToast('Cargado todos los Ejercicios','success');
    }

  }
  goEjercicioUniq(item:any,name:string){
    this.dataBookMark=[];
    this.navController.navigateForward('/' + name, {
      queryParams: {
        previusPagelistarEjercicioAll:true,
        variableEjercicio:item,
      }
    });
  }

  toggleBookmarkEjercicio(index: number): void {
    this.loading=true;
    if (this.bookmarkState[index]) {
      this.bookmarkState[index] = false;
      this.updateBookMarkUser(index,this.bookmarkState[index]);
    } else {
      this.bookmarkState[index] = true;
      this.updateBookMarkUser(index,this.bookmarkState[index]);
    }
    this.dataEjercicio = this.dataEjercicio.filter((element) => this.bookmarkState[element.IDEJERCICIO]);
    setTimeout(() => {
      this.loading=false;
    }, 500);
  }
  MessagePremium(){
    this.presentCustomToast('Ejercicio Premium, Suscribase para acceder a ellos','warning');
  }
  go_page(name: string){
    this.dataEjercicio=[];
    this.navController.navigateForward('/'+name);
  }
  go_pageback(){
  if(this.previusPagecontratoEntrenador){
      const name='contrato-entrenador';
      this.navController.navigateForward('/'+name);
    }
    else{
      const name='main';
      this.navController.navigateForward('/'+name);
    }
  }
  public onInputChange(event: any) {
    const currentSearchTerm = event.target.value;
    if (this.previousSearchTerm && currentSearchTerm.length < this.previousSearchTerm.length) {
      this.dataEjercicio=this.dataEjercicioOrig;
    }
    this.previousSearchTerm = currentSearchTerm;
    this.filterItems();
  }

  onCardTouchStart(event: TouchEvent,data:any) {

    this.touchTimeout = setTimeout(() => {
     data.viewvideo=true;
    }, 500);
  }

  onCardTouchEnd(event: TouchEvent,data:any) {
    data.viewvideo=false;
    clearTimeout(this.touchTimeout);
  }



  private filterItems() {
    this.dataEjercicioParcial = this.dataEjercicioOrig;

    const searchTerms = this.searchTerm.toLowerCase().trim().split(' ');
    if (searchTerms.length >= 1) {
      let filteredArray: any[] = [];
      for (const term of searchTerms) {
        const filteredItems = this.dataEjercicio.filter(item =>
          (item.DESCRIPCIONEJERCICIO && item.DESCRIPCIONEJERCICIO.toLowerCase().includes(term)) ||
          (item.DESCRIPCIONMULTIMEDIA && item.DESCRIPCIONMULTIMEDIA.toLowerCase().includes(term)) ||
          (item.INTRUCCIONESEJERCICIO && item.INTRUCCIONESEJERCICIO.toLowerCase().includes(term)) ||
          (item.NOMBREEJERCICIO && item.NOMBREEJERCICIO.toLowerCase().includes(term)) ||
          (item.NOMBREOBJETIVOSMUSCULARES && item.NOMBREOBJETIVOSMUSCULARES.toLowerCase().includes(term)) ||
          (item.NOMBRETIPOEJERCICIO && item.NOMBRETIPOEJERCICIO.toLowerCase().includes(term)) ||
          (item.OBSERVACIONESEJERCICIO && item.OBSERVACIONESEJERCICIO.toLowerCase().includes(term)) ||
          (item.OBSERVACIONMULTIMEDIA && item.OBSERVACIONMULTIMEDIA.toLowerCase().includes(term)) ||
          (item.PESOLEVANTADOEJERCICIO && item.PESOLEVANTADOEJERCICIO.toLowerCase().includes(term)) ||
          (item.PREMIER && item.PREMIER.toLowerCase().includes(term)) ||
          (item.TITULOMULTIMEDIA && item.TITULOMULTIMEDIA.toLowerCase().includes(term)) ||
          (item.TITULOS_EQUIPOS_REQUERIDOS && item.TITULOS_EQUIPOS_REQUERIDOS.toLowerCase().includes(term)) ||
          (item.tituloniveldificultadejercicio && item.tituloniveldificultadejercicio.toLowerCase().includes(term))
        );
        filteredArray = filteredArray.concat(filteredItems);
      }
      // Eliminar duplicados del array filtrado
      this.dataEjercicioParcial = Array.from(new Set(filteredArray));
    }
  }


  obtenerDuracionEnMinutos(tiempo:string):number {
    const tiempoPartes = tiempo.split(":");
    const horas = parseInt(tiempoPartes[0]);
    const minutos = parseInt(tiempoPartes[1]);
    const segundos = parseInt(tiempoPartes[2]);

    const duracionMinutos = horas * 60 + minutos + segundos / 60;

    return parseFloat(duracionMinutos.toFixed(4));
  }
  formatDuracionRutina(duracion: string): string {
    if (duracion && duracion.includes(':')) {
      const partes = duracion.split(':');
      if (partes.length === 3 && partes[0] === '00') {
        // Solo muestra minutos y segundos
        return `${parseInt(partes[1], 10)}:${partes[2]}`;
      }
    }
    // Mantén el formato original o devuelve un valor predeterminado si es necesario
    return duracion || 'N/A';
  }

  getBackgroundStyle(imageUrl: string,) {

    let gradientColor2 = '#5f48898a' ; // Color del primer punto del gradiente
    let gradientColor1 = '#000000b3' ; // Color del segundo punto del gradiente
    let backgroundImage = `linear-gradient(183deg, ${gradientColor1}, ${gradientColor2}), url('${this.ip_address}/multimedia/${this.getVideoName(imageUrl)}.jpg')`;

    return {
      'background-image': backgroundImage,
      'background-repeat': 'no-repeat',
      'background-size': 'cover'
    };
  }

  autoplayVideo(event: Event) {
    const video: HTMLVideoElement = this.videoPlayer.nativeElement;
    video.muted = true;
    if (this.isPlaying) {
      video.play();
    }
  }

  llenarMasDatos(){
    const endIndex = Math.ceil(this.dataEjercicioParcial.length / this.dividendo);
    const start = endIndex * this.dividendo;
    const end = endIndex * this.dividendo + this.dividendo;
    const additionalData = this.dataEjercicio.slice(start, end > this.dataEjercicio.length ? this.dataEjercicio.length : end);
    this.dataEjercicioParcial.push(...additionalData);
  }

  async presentCustomToast(message: string, color: string) {
  const toast = await this.toastController.create({
    message: message,
    duration: 1000,
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


  obtenerGetPerfilCompleto(nickname:string){
    this.apiService.connsultPerfilUsuarioCompleto(nickname).subscribe(
      (response) => {
        this.userSesionPerfil=response;
      },
      (error) => {
        this.presentCustomToast(error.error.error,"danger");
      }
    );
  }

  obtenerContratoEntrenadoresUsuario(){
    this.apiService.obtenerContratoEntrenadoresUsuario(this.userSesionPerfil && this.userSesionPerfil[0].IDUSUARIO).subscribe(
      (response) => {
        this.dataEntrenadorUsuarios=response;
        this.obtenerEjercicios();
      },
      (error) => {
        this.presentCustomToast(error.error.error,"danger");
      }
    );
  }

  obtenerEjercicios(){
    this.apiService.getEjercicioActivate().subscribe(
      (response) => {
        this.dataEjercicio=response;
        this.dataEjercicio.forEach((ejercicio) => {
        ejercicio.CALORIASEJERCICIO= (this.obtenerDuracionEnMinutos(ejercicio.TIEMPOMULTIMEDIA)/60*ejercicio.METEJERCICIO*Number(this.userSesionPerfil[0].PESOUSUARIO)).toFixed(2);
        });
        try {
          if (this.dataEntrenadorUsuarios  && this.dataEjercicio && this.dataEjercicio.length>0) {
            this.dataEjercicio = this.dataEjercicio.filter(elemento =>{
              if(this.dataEntrenadorUsuarios.some(item => item.IDPERSONA === elemento.IDENTRENADOR )){
                elemento.PREMIER = 'Suscripto';
                return true;
              }else if(elemento.IDROLUSUARIO===99){
                elemento.PREMIER = 'Gratis';
                return true;
              }else{
                elemento.PREMIER = 'Premium';
                return true;
              }
            }
            );
          }
        } catch (error) {
          this.presentCustomToast('Error en Mostrar Ejercicios','danger');

        }
        if (this.dataEntrenadorUsuarios &&  this.dataEjercicio && this.dataEjercicio.length>0) {
        this.dataEjercicio.sort((a, b) => {
          const premierOrder: { [key: string]: number } = {
            Principiante: 0,
            Intermedio: 1,
            Avanzado: 2,
          };
          const premierA = premierOrder[a.tituloniveldificultadejercicio];
          const premierB = premierOrder[b.tituloniveldificultadejercicio];
          return premierA - premierB;
        });
        }
        let nivelDificultadActual = "";
        for (let i = 0; i < this.dataEjercicio.length; i++) {
          const ejercicio = this.dataEjercicio[i];
          const nivelDificultad = ejercicio.tituloniveldificultadejercicio;

          if (nivelDificultad !== nivelDificultadActual) {
            ejercicio.mostrarNivelDificultad = true;
            nivelDificultadActual = nivelDificultad;
          } else {
            ejercicio.mostrarNivelDificultad = false;
          }
        }
        this.dataEjercicioParcial=this.dataEjercicio.slice(0, this.dividendo);
        const rawData = this.dataEjercicio;
        this.dataEjercicioOrig = rawData.map(item => ({ ...item }));
        this.cargarImagenesBefores();
      },
      (error) => {
        this.presentCustomToast(error.error.error,"danger");
      }
    );
  }


  obtenerBookMarkUser(){
    this.apiService.allBookmark('bookmarkpersona').subscribe(
      (response) => {
        this.dataBookMark=response;
        this.dataBookMark= this.dataBookMark.filter(element=>element.IDPERSONA ===this.userSesionPerfil[0].IDPERSONA)
        this.dataBookMark.forEach(bookmark => {
          this.bookmarkState[bookmark.IDEJERCICIO] = true;
        });
      },
      (error) => {
        this.presentCustomToast(error.error.error,"danger");
      }
    );
  }

  updateBookMarkUser(idEjercicio:number,status:boolean){
    this.apiService.updateBookmarkpersona( idEjercicio,this.userSesionPerfil[0].IDPERSONA,status,'bookmarkpersona').subscribe(
      (response) => {
        this.presentCustomToast(response.message,"success");
      },
      (error) => {
        this.presentCustomToast(error.error.error,"danger");
      }
    );
  }
}
