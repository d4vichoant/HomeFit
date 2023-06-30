import { Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { ApiServiceService } from '../../../api-service.service';
import { StatusBar } from '@capacitor/status-bar';
import { NavController, ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { IP_ADDRESS } from '../../../constantes';
import SwiperCore, { Autoplay } from 'swiper';


SwiperCore.use([Autoplay]);

@Component({
  selector: 'app-listar-ejercicios',
  templateUrl: './listar-ejercicios.page.html',
  styleUrls: ['./listar-ejercicios.page.scss'],
})
export class ListarEjerciciosPage implements OnInit {
  public ip_address = IP_ADDRESS;

  @ViewChild('slides', { static: false }) slides: any;

  public userSesion!:string;
  public userSesionPerfil!:any;
  public loading = true;

  public dataOPersoales!: any[];
  public dataTEjercicio!: any[];
  public dataOMusculares!: any[];

  currentDate!: string;
  constructor(private navController: NavController,
    private apiService: ApiServiceService,
    private storage: Storage,
    public toastController: ToastController) { }

  ngOnInit() {
    this.validateSesion();
    //this.test();
  }
  ionViewDidEnter() {
    this.validateSesion();
    //this.test();
  }

  test(){
    this.obtenerOMuscular();
    this.updateCurrentDate();
    this.chanceColorFooter();
    this.StatusBar();
    this.obtenerOPersonales();
    this.obtenerTEjercicios();
    this.loading=false;
  }
  StatusBar(){
    StatusBar.hide();
    StatusBar.setOverlaysWebView({ overlay: true });
    StatusBar.setBackgroundColor({ color: '#ffffff' });
  }
  validateSesion(){
    try{
      this.storage.get('sesion').then((sesion) => {
        if (sesion && JSON.parse(sesion).rolUsuario == 1) {
          this.userSesion = JSON.parse(sesion).nickname;
          this.obtenerGetPerfilCompleto(this.userSesion);
          this.apiService.protectedRequestWithToken(JSON.parse(sesion).token).subscribe(
            (response) => {
              this.updateCurrentDate();
              this.chanceColorFooter();
              this.StatusBar();
              this.obtenerOPersonales();
              this.obtenerOMuscular();
              this.obtenerTEjercicios();
              //this.loading=false;
            },
            (error) => {
              this.handleError();
            }
          );
        } else {
          this.handleError();
        }
      });
    } catch (error) {
      this.handleError();
    }
  }
  private handleError() {
    this.loading = false;
    this.navController.navigateForward('/error-page-users-trainers');
    this.storage.remove('sesion');
  }
  private chanceColorFooter(){
    document.documentElement.style.setProperty('--activate-foot10',' transparent');
    document.documentElement.style.setProperty('--activate-foot11',' #6b6a6b');
    document.documentElement.style.setProperty('--activate-foot20',' #9259f9');
    document.documentElement.style.setProperty('--activate-foot21',' #9259f9');
    document.documentElement.style.setProperty('--activate-foot30',' transparent');
    document.documentElement.style.setProperty('--activate-foot31',' #6b6a6b');
    document.documentElement.style.setProperty('--activate-foot40',' transparent');
    document.documentElement.style.setProperty('--activate-foot41',' #6b6a6b');
  }

  cargarImagenesBefores(){
    const oPersonales = this.dataOPersoales;
    const imageUrls = [];
    if (Array.isArray(oPersonales)) {
      for (let i = 0; i < oPersonales.length; i++) {
        const nameImagen = oPersonales[i].IMAGEOBJETIVOSPERSONALES;
        const imageUrl = this.ip_address+'/media/objetivospersonales/'+nameImagen;
        imageUrls.push(imageUrl);
      }
    }
    const oMusculares = this.dataOMusculares;
    if (Array.isArray(oMusculares)) {
      for (let i = 0; i < oMusculares.length; i++) {
        const nameImagen = oMusculares[i].IMAGENOBJETIVOSMUSCULARES;
        const imageUrl = this.ip_address+'/media/objetivomuscular/'+nameImagen;
        imageUrls.push(imageUrl);
      }
    }
    const TEjercicio = this.dataTEjercicio;
    if (Array.isArray(TEjercicio)) {
      for (let i = 0; i < TEjercicio.length; i++) {
        const nameImagen = TEjercicio[i].IMAGETIPOEJERCICIO;
        const imageUrl = this.ip_address+'/media/tipoEjercicio/'+nameImagen;
        imageUrls.push(imageUrl);
      }
    }

    let imagesLoaded = 0;
    //console.log(imageUrls);
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

  go_page_create(name: string, data: any) {
    if(name!== 'listar-sesiones'){
      this.navController.navigateForward('/' + name, {
        queryParams: {
          variableParametro: data
        }
      });
    }else{
      this.navController.navigateForward('/' + name, {
        queryParams: {
          variableSesiones: data
        }
      });
    }
  }
  swiperSlideChanged(e: any){
    //console.log(e);
  }
  swiperReady() {
    // After the slides have loaded, start the autoplay
    this.slides.startAutoplay();
  }
  selectSwiper(item:any,page:string){
    this.go_page_create(page,item);
  }
  obtenerPrimerNombre(nombre:string): string {
    return nombre.split(' ')[0];
  }
  updateCurrentDate() {
    const currentDate = new Date();
    const dayOfWeek = new Intl.DateTimeFormat('es-ES', { weekday: 'long' }).format(currentDate);
    const day = currentDate.getDate();
    const month = new Intl.DateTimeFormat('es-ES', { month: 'long' }).format(currentDate);
    this.currentDate = `${dayOfWeek}, ${day} de ${month}`;
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
    this.apiService.connsultPerfilCompleto(nickname).subscribe(
      (response) => {
        this.userSesionPerfil=response;
      },
      (error) => {
        this.presentCustomToast(error.error.error,"danger");
      }
    );
  }
  obtenerOPersonales(){
    this.apiService.allObjetivosPersonales().subscribe(
      (response) => {
        this.dataOPersoales=response;
      },
      (error) => {
        this.presentCustomToast(error.error.error,"danger");
      }
    );
  }
  obtenerTEjercicios(){
    this.apiService.getTipoEjercicioActivate().subscribe(
      (response) => {
        this.dataTEjercicio=response;
        this.cargarImagenesBefores();
      },
      (error) => {
        this.presentCustomToast(error.error.error,"danger");
      }
    );
  }
  obtenerOMuscular(){
    this.apiService.getObjetivosMuscularesActivate().subscribe(
      (response) => {
        this.dataOMusculares=response;
      },
      (error) => {
        this.presentCustomToast(error.error.error,"danger");
      }
    );
  }
}