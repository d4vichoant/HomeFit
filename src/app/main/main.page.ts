import { Component, OnInit } from '@angular/core';
import { ApiServiceService } from '../api-service.service';
import { StatusBar } from '@capacitor/status-bar';
import { NavController, ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { IP_ADDRESS } from '../constantes';

@Component({
  selector: 'app-main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
})
export class MainPage implements OnInit {
  public ip_address = IP_ADDRESS;
  public userSesion!:string;
  public userSesionPerfil!:any;

  public dataRutinas!: any[];
  public dataRutinasTotal!:any[];
  public dataSesiones!:any[];

  bookmarkRutinasState: { [key: number]: boolean } = {};
  dataBookMarkRutinas!:any[];

  bookmarkSesionesState: { [key: number]: boolean } = {};
  dataBookMarkSesiones!:any[];

  LikeTEjercicioState: { [key: number]: boolean } = {};
  dataLikeTEjercicio!:any[];

  LikeOPersonalState: { [key: number]: boolean } = {};
  dataLikeOPersonal!:any[];

  LikeOMuscularState: { [key: number]: boolean } = {};
  dataLikeOMuscular!:any[];

  bookmarkState: { [key: number]: boolean } = {};
  dataBookMark!:any[];

  public dataRecomendacion!:any[];
  public dataOPersoales!: any[];
  public dataTEjercicio!: any[];
  public dataTEjercicioAll!: any[];
  public dataOMusculares!: any[];
  public dataEjercicio!: any[];

  public allobjetivospersonalesusuario!: any[];

  public loading = true;

  currentDate!: string;

  constructor(private navController: NavController,
    private apiService: ApiServiceService,
    private storage: Storage,
    public toastController: ToastController) { }
  ngOnInit() {
    this.validateSesion();
  }
  ionViewDidEnter() {
    this.validateSesion();
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
              this.obtenerbookmarksesiones();
              this.obtenerbookmarkrutinas();
              this.obtenerLikeTEjercicio();
              this.obtenerLikeOPersonal();
              this.obtenerLikeOMuscular();
              this.obtenerBookMarkUser();
              this.obtenerEjercicios();
              this.obtenerRutinas();
              this.obtenerSesiones();
              this.obtenerOMuscular();
              this.obtenerOPersonales();
              this.obtenerTEjercicios();
              this.obtenerObjetivosPersonales();
              this.StatusBar();
              this.loading=false;
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
    this.navController.navigateForward('/error-users');
    this.storage.remove('sesion');
  }
  private chanceColorFooter(){
    document.documentElement.style.setProperty('--activate-foot10',' #9259f9');
    document.documentElement.style.setProperty('--activate-foot11',' #9259f9');
    document.documentElement.style.setProperty('--activate-foot20',' transparent');
    document.documentElement.style.setProperty('--activate-foot21',' #6b6a6b');
    document.documentElement.style.setProperty('--activate-foot30',' transparent');
    document.documentElement.style.setProperty('--activate-foot31',' #6b6a6b');
    document.documentElement.style.setProperty('--activate-foot40',' transparent');
    document.documentElement.style.setProperty('--activate-foot41',' #6b6a6b');
  }

  toggleBookmarkRutinas(index: number): void {
    if (this.bookmarkRutinasState[index]) {
      this.bookmarkRutinasState[index] = false;
      this.updateLikeTEjercicio(index,this.bookmarkRutinasState[index],'bookmarkrutinas');
    } else {
      this.bookmarkRutinasState[index] = true;
      this.updateLikeTEjercicio(index,this.bookmarkRutinasState[index],'bookmarkrutinas');
    }
    this.dataRutinas = this.dataRutinas.filter((element) => this.bookmarkRutinasState[element.IDRUTINA]);
  }

  toggleBookmarkOSesiones(index: number): void {
    if (this.bookmarkSesionesState[index]) {
      this.bookmarkSesionesState[index] = false;
      this.updateLikeTEjercicio(index,this.bookmarkSesionesState[index],'bookmarksesiones');
    } else {
      this.bookmarkSesionesState[index] = true;
      this.updateLikeTEjercicio(index,this.bookmarkSesionesState[index],'bookmarksesiones');
    }
    this.dataSesiones = this.dataSesiones.filter((element) => this.bookmarkSesionesState[element.IDSESION]);
  }
  toggleBookmarkTEjercicio(index: number): void {
    if (this.LikeTEjercicioState[index]) {
      this.LikeTEjercicioState[index] = false;
      this.updateLikeTEjercicio(index,this.LikeTEjercicioState[index],'bookmarkpersona');
    } else {
      this.LikeTEjercicioState[index] = true;
      this.updateLikeTEjercicio(index,this.LikeTEjercicioState[index],'bookmarkpersona');
    }
    this.dataTEjercicio = this.dataTEjercicio.filter((element) => this.LikeTEjercicioState[element.IDTIPOEJERCICIO]);
  }
  toggleBookmarkEjercicio(index: number): void {
    if (this.bookmarkState[index]) {
      this.bookmarkState[index] = false;
      this.updateLikeTEjercicio(index,this.bookmarkState[index],'liketejercicio');
    } else {
      this.bookmarkState[index] = true;
      this.updateLikeTEjercicio(index,this.bookmarkState[index],'liketejercicio');
    }
    this.dataEjercicio = this.dataEjercicio.filter((element) => this.bookmarkState[element.IDEJERCICIO]);
  }
  toggleBookmarkOPersonal(index: number): void {
    if (this.LikeOPersonalState[index]) {
      this.LikeOPersonalState[index] = false;
      this.updateLikeTEjercicio(index,this.LikeOPersonalState[index],'likeobjetivopersonal');
    } else {
      this.LikeOPersonalState[index] = true;
      this.updateLikeTEjercicio(index,this.LikeOPersonalState[index],'likeobjetivopersonal');
    }
    this.dataOPersoales = this.dataOPersoales.filter((element) => this.LikeOPersonalState[element.IDOBJETIVOSPERSONALES]);
  }
  toggleBookmarkOMuscular(index: number): void {
    if (this.LikeOMuscularState[index]) {
      this.LikeOMuscularState[index] = false;
      this.updateLikeTEjercicio(index,this.LikeOMuscularState[index],'likeobjetivomusculares');
    } else {
      this.LikeOMuscularState[index] = true;
      this.updateLikeTEjercicio(index,this.LikeOMuscularState[index],'likeobjetivomusculares');
    }
    this.dataOMusculares = this.dataOMusculares.filter((element) => this.LikeOMuscularState[element.IDOBJETIVOSMUSCULARES]);
  }

  getVideoName(url: string): string {
    return url.split('.')[0];
  }
  selectSwiper(item:any,page:string){
    this.go_page_create(page,item);
  }
  goEjercicioUniq(itemName:any,name:string){
    this.navController.navigateForward('/' + name, {
      queryParams: {
        variableEjercicio:itemName,
        previusPageMain:true,
      }
    });
  }

  go_page_create(name: string, data: any) {
    if(name!== 'listar-sesiones'){
      this.navController.navigateForward('/' + name, {
        queryParams: {
          variableParametro: data,
          previusPageMain:true,
        }
      });
    }else{
      this.navController.navigateForward('/' + name, {
        queryParams: {
          variableSesiones: data,
          previusPageMain:true,
        }
      });
    }
  }

  go_page_create_rutina(data: any,name: string) {
    if(name==='rutinas-diarias'){
      this.navController.navigateForward('/' + name, {
        queryParams: {
          variableRutinaDiaria: data,
          previusPageMain:true,
        }
      });
    }else if (name==='programarrutinas'){
      this.navController.navigateForward('/' + name, {
        queryParams: {
          variableprogramarrutinas: data,
          previusPageMain:true,
        }
      });
    }
  }
  go_page(name: string){
    this.navController.navigateForward('/'+name);
  }
  formatDuracionRutina(duracion: string): string {
    const partes = duracion.split(':');
    if (partes.length === 3 && partes[0] === '00') {
      // Solo muestra minutos y segundos
      return `${parseInt(partes[1], 10)}:${partes[2]}`;
    }
    // Mantén el formato original
    return duracion;
  }
  findEjercicioRutina(IDEJERCICIORUTINA: number): any {
    if (this.dataEjercicio) {
      const elemento = this.dataEjercicio.find(objeto => objeto.IDEJERCICIO === IDEJERCICIORUTINA);
      return elemento;
    }
    return null;
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
  obtenerTEjercicios(){
    this.apiService.getTipoEjercicioActivate().subscribe(
      (response) => {
        this.dataTEjercicio=response;
        this.dataTEjercicioAll=response;
        this.dataTEjercicio = this.dataTEjercicio.filter((element) => this.LikeTEjercicioState[element.IDTIPOEJERCICIO]);
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
        this.dataOPersoales = this.dataOPersoales.filter((element) => this.LikeOPersonalState[element.IDOBJETIVOSPERSONALES]);
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
        this.dataOMusculares = this.dataOMusculares.filter((element) => this.LikeOMuscularState[element.IDOBJETIVOSMUSCULARES]);
      },
      (error) => {
        this.presentCustomToast(error.error.error,"danger");
      }
    );
  }
  obtenerRutinas(){
    this.apiService.getRutinasActivate().subscribe(
      (response) => {
        this.dataRutinas=response;
        this.dataRutinasTotal=response;
        this.dataRutinas = this.dataRutinas.map(objeto => ({
          ...objeto,
          IDEJERCICIOS: objeto.IDEJERCICIOS.split(",").map(Number)
        }));
        this.dataRutinasTotal = this.dataRutinasTotal.map(objeto => ({
          ...objeto,
          IDEJERCICIOS: objeto.IDEJERCICIOS.split(",").map(Number)
        }));
        this.dataRutinas = this.dataRutinas.filter((element) => this.bookmarkRutinasState[element.IDRUTINA]);
      },
      (error) => {
        this.presentCustomToast(error.error.error,"danger");
      }
    );
  }
  obtenerSesiones(){
    this.apiService.getSesionesActivate().subscribe(
      (response) => {
        this.dataSesiones=response;
        this.dataSesiones = this.dataSesiones.map(objeto => ({
          ...objeto,
          IDRUTINAS: objeto.IDRUTINAS.split(",").map(Number)
        }));
        this.dataSesiones = this.dataSesiones.filter((element) => this.bookmarkSesionesState[element.IDSESION]);
      },
      (error) => {
        this.presentCustomToast(error.error.error,"danger");
      }
    );
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
  obtenerObjetivosPersonales(){
    this.apiService.allobjetivospersonalesusuario(this.userSesionPerfil[0].IDUSUARIO).subscribe(
      (response) => {
        this.allobjetivospersonalesusuario=response;
        if(this.allobjetivospersonalesusuario){
          const idObjetivosPersonalesMasGrande = this.allobjetivospersonalesusuario[0].IDOBJETIVOSPERSONALES
          .split(',')
          .map((numero: string) => parseInt(numero));
          const resultado = this.dataRutinasTotal.filter(objeto => idObjetivosPersonalesMasGrande.includes(objeto.IDOBJETIVOSPERSONALESRUTINA));
          this.dataRecomendacion = resultado;
        }
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
        this.dataEjercicio = this.dataEjercicio.filter((element) => this.bookmarkState[element.IDEJERCICIO]);
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

  obtenerbookmarkrutinas(){
    this.apiService.allBookmark('bookmarkrutinas').subscribe(
      (response) => {
        this.dataBookMarkRutinas=response;
        this.dataBookMarkRutinas= this.dataBookMarkRutinas.filter(element=>element.IDPERSONA ===this.userSesionPerfil[0].IDPERSONA)
        this.dataBookMarkRutinas.forEach(liketejercicio => {
          this.bookmarkRutinasState[liketejercicio.IDRUTINA] = true;
        });
      },
      (error) => {
        this.presentCustomToast(error.error.error,"danger");
      }
    );
  }
  obtenerbookmarksesiones(){
    this.apiService.allBookmark('bookmarksesiones').subscribe(
      (response) => {
        this.dataBookMarkSesiones=response;
        this.dataBookMarkSesiones= this.dataBookMarkSesiones.filter(element=>element.IDPERSONA ===this.userSesionPerfil[0].IDPERSONA)
        this.dataBookMarkSesiones.forEach(liketejercicio => {
          this.bookmarkSesionesState[liketejercicio.IDSESION] = true;
        });
      },
      (error) => {
        this.presentCustomToast(error.error.error,"danger");
      }
    );
  }
  obtenerLikeTEjercicio(){
    this.apiService.allBookmark('liketejercicio').subscribe(
      (response) => {
        this.dataLikeTEjercicio=response;
        this.dataLikeTEjercicio= this.dataLikeTEjercicio.filter(element=>element.IDPERSONA ===this.userSesionPerfil[0].IDPERSONA)
        this.dataLikeTEjercicio.forEach(liketejercicio => {
          this.LikeTEjercicioState[liketejercicio.IDTIPOEJERCICIO] = true;
        });
      },
      (error) => {
        this.presentCustomToast(error.error.error,"danger");
      }
    );
  }
  obtenerLikeOPersonal(){
    this.apiService.allBookmark('likeobjetivopersonal').subscribe(
      (response) => {
        this.dataLikeOPersonal=response;
        this.dataLikeOPersonal= this.dataLikeOPersonal.filter(element=>element.IDPERSONA ===this.userSesionPerfil[0].IDPERSONA)
        this.dataLikeOPersonal.forEach(liketejercicio => {
          this.LikeOPersonalState[liketejercicio.IDOBJETIVOSPERSONALES] = true;
        });
      },
      (error) => {
        this.presentCustomToast(error.error.error,"danger");
      }
    );
  }
  obtenerLikeOMuscular(){
    this.apiService.allBookmark('likeobjetivomusculares').subscribe(
      (response) => {
        this.dataLikeOMuscular=response;
        this.dataLikeOMuscular= this.dataLikeOMuscular.filter(element=>element.IDPERSONA ===this.userSesionPerfil[0].IDPERSONA)
        this.dataLikeOMuscular.forEach(liketejercicio => {
          this.LikeOMuscularState[liketejercicio.IDOBJETIVOSMUSCULARES] = true;
        });
      },
      (error) => {
        this.presentCustomToast(error.error.error,"danger");
      }
    );
  }
  updateLikeTEjercicio(idEjercicio:number,status:boolean,type:string){
    this.apiService.updateBookmarkpersona( idEjercicio,this.userSesionPerfil[0].IDPERSONA,status,type).subscribe(
      (response) => {
        this.presentCustomToast(response.message,"success");
      },
      (error) => {
        this.presentCustomToast(error.error.error,"danger");
      }
    );
  }
}

