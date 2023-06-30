import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StatusBar } from '@capacitor/status-bar';
import { NavController, ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { IP_ADDRESS } from '../../../constantes';
import { ApiServiceService } from '../../../api-service.service';

@Component({
  selector: 'app-listar-parametros',
  templateUrl: './listar-parametros.page.html',
  styleUrls: ['./listar-parametros.page.scss'],
})
export class ListarParametrosPage implements OnInit {
  public userSesion!:string;
  public userSesionPerfil!:any;
  public loading = true;

  public ip_address = IP_ADDRESS;

  isFilled = false;
  bookmarkState: { [key: number]: boolean } = {};
  variable!:any;

  public dataEjercicio!: any[];
  public dataEjercicioOrig!: any[];
  valueNivel:number=-1;

  dataBookMark!:any[];

  constructor(private navController: NavController,
  private route: ActivatedRoute,
  private apiService: ApiServiceService,
  private storage: Storage,
  public toastController: ToastController
  ) {
  }

  ngOnInit() {
    this.recuperarDatos();
    this.validateSesion();
    this.valueNivel=-1;
    //this.test();

  }
  ionViewDidEnter() {
    this.recuperarDatos();
    this.validateSesion();
    this.valueNivel=-1;
    //this.test();
  }
  test(){
    this.chanceColorFooter();
    this.StatusBar();
    this.obtenerBookMarkUser();
    this.obtenerEjercicios();
    this.loading=false;
  }
  recuperarDatos(){
    this.route.queryParams.subscribe(params => {
      this.variable = params['variableParametro'] as any;
    });
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
              this.chanceColorFooter();
              this.StatusBar();
              this.obtenerBookMarkUser();
              this.obtenerEjercicios();
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

  getVideoName(url: string): string {
    return url.split('.')[0];
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

  go_page(name: string){
    this.navController.navigateForward('/' + name, {
      queryParams: {
        variableParametro: ""
      }
    });
  }
  nivelChange(){
    if (this.valueNivel === 0) {
      this.dataEjercicio =this.dataEjercicioOrig;
      this.valueNivel = 1;
      this.dataEjercicio = this.dataEjercicio.filter(element => element.IDNIVELDIFICULTADEJERCICIO === 1);
    } else if (this.valueNivel === 1) {
      this.dataEjercicio =this.dataEjercicioOrig;
      this.dataEjercicio = this.dataEjercicio.filter(element => element.IDNIVELDIFICULTADEJERCICIO === 2);
      this.valueNivel = 2;
    } else if(this.valueNivel === 2) {
      this.dataEjercicio =this.dataEjercicioOrig;
      this.valueNivel = -1;
    } else{
      this.dataEjercicio =this.dataEjercicioOrig;
      this.dataEjercicio = this.dataEjercicio.filter(element => element.IDNIVELDIFICULTADEJERCICIO === 0);
      this.valueNivel = 0;
    }
  }
  toggleBookmark(index: number): void {
    if (this.bookmarkState[index]) {
      this.bookmarkState[index] = false;
      this.updateBookMarkUser(index,this.bookmarkState[index]);
    } else {
      this.bookmarkState[index] = true;
      this.updateBookMarkUser(index,this.bookmarkState[index]);
    }
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
  obtenerEjercicios(){
    this.apiService.getEjercicioActivate().subscribe(
      (response) => {
        this.dataEjercicio=response;
        if ( this.variable.IDTIPOEJERCICIO && this.variable.IDTIPOEJERCICIO!==null || this.variable.IDTIPOEJERCICIO!==undefined){
          this.dataEjercicio = this.dataEjercicio.filter(element => element.IDTIPOEJERCICIO === this.variable.IDTIPOEJERCICIO  );
        }else if (this.variable.IDOBJETIVOSMUSCULARES && this.variable.IDOBJETIVOSMUSCULARES!==null || this.variable.IDOBJETIVOSMUSCULARES!==undefined){
          this.dataEjercicio = this.dataEjercicio.filter(element => element.IDOBJETIVOMUSCULAR === this.variable.IDOBJETIVOSMUSCULARES );
        }
        const rawData = this.dataEjercicio;
        this.dataEjercicioOrig = rawData.map(item => ({ ...item }));
        if (this.dataEjercicio && this.dataEjercicio.length>0)
        this.cargarImagenesBefores();
        else
        this.loading=false;
      },
      (error) => {
        this.presentCustomToast(error.error.error,"danger");
      }
    );
  }
  obtenerBookMarkUser(){
    this.apiService.allBookmarkpersona().subscribe(
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
    this.apiService.updateBookmarkpersona( idEjercicio,this.userSesionPerfil[0].IDPERSONA,status).subscribe(
      (response) => {
        this.presentCustomToast(response.message,"success");
      },
      (error) => {
        this.presentCustomToast(error.error.error,"danger");
      }
    );
  }
}
