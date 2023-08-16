import { Component, OnInit } from '@angular/core';
import { ApiServiceService } from '../api-service.service';
import { StatusBar, StatusBarStyle } from '@capacitor/status-bar';
import { AlertController, NavController, ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { IP_ADDRESS } from '../constantes';
import { Observable } from 'rxjs';

import { LocalNotifications, ScheduleOptions } from '@capacitor/local-notifications';

@Component({
  selector: 'app-main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
})
export class MainPage implements OnInit {
  public ip_address = IP_ADDRESS;
  public userSesion!:string;
  public userSesionPerfil!:any;

  dataEntrenadorUsuarios!:any[];

  public dataRutinas!: any[];
  public dataRutinasTotal!:any[];

  public dataSesiones!:any[];

  dataprocesosQuedados!:any[];

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

  totalRutinas!:any[];
  totalSesiones!:any[];
  totalEjercicio!:any[];

  constructor(private navController: NavController,
    private apiService: ApiServiceService,
    private storage: Storage,
    public toastController: ToastController,
    public alertController: AlertController) { }
  ngOnInit() {
    this.validateSesion();
    document.documentElement.style.setProperty('--background-ip-address-main','url('+IP_ADDRESS+'/media/images/backgroundMain.jpg)');
  }
  ionViewDidEnter() {
    this.validateSesion();
    document.documentElement.style.setProperty('--background-ip-address-main','url('+IP_ADDRESS+'/media/images/backgroundMain.jpg)');
  }
  StatusBar(){
    //StatusBar.hide();
    StatusBar.setOverlaysWebView({ overlay: true });
    StatusBar.setBackgroundColor({color:'transparent'});
    StatusBar.setStyle({ style: StatusBarStyle.Dark });
  }
  async validateSesion() {
    try {
      const sesion = await this.storage.get('sesion');
      if (sesion && JSON.parse(sesion).rolUsuario == 1) {
        this.userSesion = JSON.parse(sesion).nickname;
        this.obtenerGetPerfilCompleto(this.userSesion);
        const response = await this.apiService.protectedRequestWithToken(JSON.parse(sesion).token).toPromise();
        this.updateCurrentDate();
        this.chanceColorFooter();
        this.totalEjercicio = await this.obtenercontarTypes('ejercicio');
        this.totalRutinas = await this.obtenercontarTypes('rutina');
        this.totalSesiones = await this.obtenercontarTypes('programarsesion');
        this.obtenerbookmarksesiones();
        this.obtenerbookmarkrutinas();
        this.obtenerLikeTEjercicio();
        this.obtenerLikeOPersonal();
        this.obtenerLikeOMuscular();
        this.obtenerBookMarkUser();
        this.obtenerEjercicios();
        this.obtenerContratoEntrenadoresUsuario();
        this.obtenerRutinas();
        this.obtenerSesiones();
        this.obtenerOMuscular();
        this.obtenerOPersonales();
        this.obtenerTEjercicios();
        this.obtenerObjetivosPersonales();
        this.obtenerProgresousuario();
        this.StatusBar();
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

  async scheduleNotification() {
    // Define la hora a la que deseas que aparezca la notificación (en este caso, a las 8:00 PM).
    const notificationTime = new Date();
    notificationTime.setHours(19); // Hora (24 horas)
    notificationTime.setMinutes(0); // Minutos
    notificationTime.setSeconds(0); // Segundos

    let options: ScheduleOptions = {
      notifications: [
        {
          id: 111,
          title: '¡Hora de ponerte en movimiento!',
          body: 'Abre la app y comienza tu rutina de entrenamiento. ¡No te arrepentirás!',
          largeBody: ' Abre la app y dedica un tiempo para ejercitarte hoy',
          schedule: { at: notificationTime, every: 'day' },
          /* schedule: { at: new Date(Date.now() + 500) }, */
          summaryText: ' ¡A entrenar!',
          smallIcon:'res://drawable/iconhomeviolet',
        },
      ],
    };

    try {
      await LocalNotifications.schedule(options);
    } catch (ex) {
      alert(JSON.stringify(ex));
    }
  }

  private chanceColorFooter(){
    document.documentElement.style.setProperty('--activate-foot10',' #ffffff');
    document.documentElement.style.setProperty('--activate-foot11',' #ffffff');
    document.documentElement.style.setProperty('--activate-foot12',' #ffffff6b');
    document.documentElement.style.setProperty('--activate-foot20',' transparent');
    document.documentElement.style.setProperty('--activate-foot21',' #ffffffab');
    document.documentElement.style.setProperty('--activate-foot22',' transparent');
    document.documentElement.style.setProperty('--activate-foot30',' transparent');
    document.documentElement.style.setProperty('--activate-foot31',' #ffffffab');
    document.documentElement.style.setProperty('--activate-foot32',' transparent');
    document.documentElement.style.setProperty('--activate-foot40',' transparent');
    document.documentElement.style.setProperty('--activate-foot41',' #ffffffab');
    document.documentElement.style.setProperty('--activate-foot42',' transparent');
    document.documentElement.style.setProperty('--activate-foot50',' transparent');
    document.documentElement.style.setProperty('--activate-foot51',' #ffffffab');
    document.documentElement.style.setProperty('--activate-foot52',' transparent');
  }


  cargarImagenesBefores(){
    const dataTEjercicioAll = this.dataTEjercicioAll;
    const imageUrls = [];
    if (Array.isArray(dataTEjercicioAll)) {
      for (let i = 0; i < dataTEjercicioAll.length; i++) {
        const nameImagen = dataTEjercicioAll[i].IMAGETIPOEJERCICIO;
        const imageUrl = this.ip_address+'/media/tipoEjercicio/'+nameImagen;
        imageUrls.push(imageUrl);
      }
    }
    const imageUrl1 = this.ip_address+'/media/images/recomendacion.jpg';
    imageUrls.push(imageUrl1);

    const datarecomendacion = this.dataRecomendacion;
    if (Array.isArray(datarecomendacion)) {
      for (let i = 0; i < datarecomendacion.length; i++) {
        const nameImagen = datarecomendacion[i].IMAGENRUTINA;
        const imageUrl = this.ip_address+'/media/rutinas/portadasrutinas/'+nameImagen;
        imageUrls.push(imageUrl);
      }
    }
    const imageUrl2 = this.ip_address+'/media/images/retomar.jpg';
    imageUrls.push(imageUrl2);

    const dataEjercicio = this.dataEjercicio;
    if (Array.isArray(dataEjercicio)) {
      for (let i = 0; i < dataEjercicio.length; i++) {
        const nameImagen = this.getVideoName(dataEjercicio[i].ALMACENAMIENTOMULTIMEDIA)+'.jpg';
        const imageUrl = this.ip_address+'/multimedia/'+nameImagen;
        imageUrls.push(imageUrl);
      }
    }


    const dataRutinas = this.dataRutinas;
    if (Array.isArray(dataRutinas)) {
      for (let i = 0; i < dataRutinas.length; i++) {
        const nameImagen = dataRutinas[i].IMAGENRUTINA;
        const imageUrl = this.ip_address+'/media/rutinas/portadasrutinas/'+nameImagen;
        imageUrls.push(imageUrl);
      }
    }

    const dataSesiones = this.dataSesiones;
    if (Array.isArray(dataSesiones)) {
      for (let i = 0; i < dataSesiones.length; i++) {
        const nameImagen = dataSesiones[i].IMAGESESION;
        const imageUrl = this.ip_address+'/media/sesiones/portadassesiones/'+nameImagen;
        imageUrls.push(imageUrl);
      }
    }
    const dataTEjercicio = this.dataTEjercicio;
    if (Array.isArray(dataTEjercicio)) {
      for (let i = 0; i < dataTEjercicio.length; i++) {
        const nameImagen = dataTEjercicio[i].IMAGETIPOEJERCICIO;
        const imageUrl = this.ip_address+'/media/tipoEjercicio/'+nameImagen;
        imageUrls.push(imageUrl);
      }
    }
    const dataOPersoales = this.dataOPersoales;
    if (Array.isArray(dataOPersoales)) {
      for (let i = 0; i < dataOPersoales.length; i++) {
        const nameImagen = dataOPersoales[i].IMAGEOBJETIVOSPERSONALES;
        const imageUrl = this.ip_address+'/media/objetivospersonales/'+nameImagen;
        imageUrls.push(imageUrl);
      }
    }
    const dataOMusculares = this.dataOMusculares;
    if (Array.isArray(dataOMusculares)) {
      for (let i = 0; i < dataOMusculares.length; i++) {
        const nameImagen = dataOMusculares[i].IMAGENOBJETIVOSMUSCULARES;
        const imageUrl = this.ip_address+'/media/objetivomuscular/'+nameImagen;
        imageUrls.push(imageUrl);
      }
    }

    const imageUrl5 = this.ip_address+'/media/images/guardado-blureable.jpg';
    imageUrls.push(imageUrl5);
    const imageUrl6 = this.ip_address+'/media/images/backgroundMain.jpg';
    imageUrls.push(imageUrl6);
    const imageUrl7 = this.ip_address+'/media/images/collage_trainers.png';
    imageUrls.push(imageUrl7);
    let imagesLoaded = 0;
    const totalImages = imageUrls.length;
    const handleImageLoad = () => {
      imagesLoaded++;
      if (imagesLoaded === totalImages) {
        setTimeout(() => {
          this.loading = false;
        }, 2000);
      }
    };
    imageUrls.forEach((imageUrl) => {
      const image = new Image();
      image.onload = handleImageLoad;
      image.src = imageUrl;
    });
    setTimeout(() => {
      this.loading=false;
    }, 500);
  }
  convertirAMinusculas(texto: string): string {
    return texto.toLowerCase();
  }

  redondearNumero(numero: number): number {
    return Number(numero.toFixed(2));
  }

  recortarPalabras(texto: string, numeroPalabras: number): string {
    const palabras = texto.split(' ');
    const palabrasRecortadas = palabras.slice(0, numeroPalabras);
    const resultado = palabrasRecortadas.join(' ');
    return resultado;
  }

  toggleBookmarkRutinas(index: number): void {
    this.loading=true;
    if (this.bookmarkRutinasState[index]) {
      this.bookmarkRutinasState[index] = false;
      this.updateLikeTEjercicio(index,this.bookmarkRutinasState[index],'bookmarkrutinas');
    } else {
      this.bookmarkRutinasState[index] = true;
      this.updateLikeTEjercicio(index,this.bookmarkRutinasState[index],'bookmarkrutinas');
    }
    this.dataRutinas = this.dataRutinas.filter((element) => this.bookmarkRutinasState[element.IDRUTINA]);
    setTimeout(() => {
      this.loading=false;
    }, 500);
  }

  toggleBookmarkOSesiones(index: number): void {
    this.loading=true;
    if (this.bookmarkSesionesState[index]) {
      this.bookmarkSesionesState[index] = false;
      this.updateLikeTEjercicio(index,this.bookmarkSesionesState[index],'bookmarksesiones');
    } else {
      this.bookmarkSesionesState[index] = true;
      this.updateLikeTEjercicio(index,this.bookmarkSesionesState[index],'bookmarksesiones');
    }
    this.dataSesiones = this.dataSesiones.filter((element) => this.bookmarkSesionesState[element.IDSESION]);
    setTimeout(() => {
      this.loading=false;
    }, 500);
  }
  toggleBookmarkTEjercicio(index: number): void {
    this.loading=true;
    if (this.LikeTEjercicioState[index]) {
      this.LikeTEjercicioState[index] = false;
      this.updateLikeTEjercicio(index,this.LikeTEjercicioState[index],'liketejercicio');
    } else {
      this.LikeTEjercicioState[index] = true;
      this.updateLikeTEjercicio(index,this.LikeTEjercicioState[index],'liketejercicio');
    }
    this.dataTEjercicio = this.dataTEjercicio.filter((element) => this.LikeTEjercicioState[element.IDTIPOEJERCICIO]);
    setTimeout(() => {
      this.loading=false;
    }, 500);
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
  toggleBookmarkOPersonal(index: number): void {
    this.loading=true;
    if (this.LikeOPersonalState[index]) {
      this.LikeOPersonalState[index] = false;
      this.updateLikeTEjercicio(index,this.LikeOPersonalState[index],'likeobjetivopersonal');
    } else {
      this.LikeOPersonalState[index] = true;
      this.updateLikeTEjercicio(index,this.LikeOPersonalState[index],'likeobjetivopersonal');
    }
    this.dataOPersoales = this.dataOPersoales.filter((element) => this.LikeOPersonalState[element.IDOBJETIVOSPERSONALES]);
    setTimeout(() => {
      this.loading=false;
    }, 500);
  }
  toggleBookmarkOMuscular(index: number): void {
    this.loading=true;
    if (this.LikeOMuscularState[index]) {
      this.LikeOMuscularState[index] = false;
      this.updateLikeTEjercicio(index,this.LikeOMuscularState[index],'likeobjetivomusculares');
    } else {
      this.LikeOMuscularState[index] = true;
      this.updateLikeTEjercicio(index,this.LikeOMuscularState[index],'likeobjetivomusculares');
    }
    this.dataOMusculares = this.dataOMusculares.filter((element) => this.LikeOMuscularState[element.IDOBJETIVOSMUSCULARES]);
    setTimeout(() => {
      this.loading=false;
    }, 500);
  }

  getVideoName(url: string): string {
    if (url !== null) {
      return url.split('.')[0];
    } else {
      return '';
    }
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

  async confirmcleandatahistory(data:any,index:number){
    const alert = await this.alertController.create({
      header: 'Confirmar Limpieza',
      message: '¿Estás seguro que desea ocultar este proceso realizado ?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            this.presentCustomToast('Proceso cancelada',"danger");
          }
        }, {
          text: 'Aceptar',
          handler: () => {
            this.changeShowProgresoUsuario(data.IDPROGRESOUSUARIO);
            if (index >= 0 && index < this.dataprocesosQuedados.length) {
              this.dataprocesosQuedados.splice(index, 1);
            }
          }
        }
      ]
    });
    await alert.present();
  }

  goEjercicioUniqWithDates(data:any,name:string){
    if(data.IDSESION && data.IDRUTINA && data.IDEJERCICIO){
      this.obtenerSesionesidSesion(data.IDSESION).subscribe(
        (dataSesion) => {
          this.obtenerRutinasidRutina(data.IDRUTINA).subscribe(
            (dataRutina) => {
              this.obtenerEjerciciosidEjercicio(data.IDEJERCICIO).subscribe(
                (itemName) => {
                  dataRutina = dataRutina.map((objeto:any)=> ({
                    ...objeto,
                    IDEJERCICIOS: objeto.IDEJERCICIOS.split(",").map(Number)
                  }));
                  dataSesion=dataSesion.map((objeto:any) => ({
                    ...objeto,
                    IDRUTINAS: objeto.IDRUTINAS.split(",").map(Number)
                  }));

                  this.navController.navigateForward('/' + name, {
                    queryParams: {
                      variableEjercicio:itemName[0],
                      variableEjercicios: dataRutina[0].IDEJERCICIOS,
                      variableEjerciciositem:data.progress_numeroEjercicio,

                      variableprogramarrutinas: dataSesion[0],
                      variableRutinas:dataSesion[0].IDRUTINAS,
                      variableRutinasitem:data.progress_numeroRutina,

                      variableRutinaDiaria:dataRutina[0],

                      previusPageMain: true,
                      IDPROGRESOUSUARIO:data.IDPROGRESOUSUARIO,
                    }
                  });
                },
                (error) => {
                  this.presentCustomToast(error.error.error, "danger");
                }
              );
            },
            (error) => {
              this.presentCustomToast(error.error.error, "danger");
            }
          );

        },
        (error) => {
          this.presentCustomToast(error.error.error, "danger");
        }
      );
    }else if(data.IDRUTINA && data.IDEJERCICIO){
      this.obtenerRutinasidRutina(data.IDRUTINA).subscribe(
        (dataRutina) => {
          this.obtenerEjerciciosidEjercicio(data.IDEJERCICIO).subscribe(
            (itemName) => {
              dataRutina = dataRutina.map((objeto:any)=> ({
                ...objeto,
                IDEJERCICIOS: objeto.IDEJERCICIOS.split(",").map(Number)
              }));
              this.navController.navigateForward('/' + name, {
                queryParams: {
                  variableEjercicios: dataRutina[0].IDEJERCICIOS,
                  variableEjerciciositem:data.progress_numeroEjercicio,

                  variableEjercicio:itemName[0],
                  variableRutinaDiaria:dataRutina[0],

                  previusPageMain: true,
                  IDPROGRESOUSUARIO:data.IDPROGRESOUSUARIO,
                }
              });
            },
            (error) => {
              this.presentCustomToast(error.error.error, "danger");
            }
          );
        },
        (error) => {
          this.presentCustomToast(error.error.error, "danger");
        }
      );

    }else{
      this.obtenerEjerciciosidEjercicio(data.IDEJERCICIO).subscribe(
        (itemName) => {
          this.navController.navigateForward('/' + name, {
            queryParams: {
              variableEjercicio: itemName[0],
              previusPageMain: true,
              IDPROGRESOUSUARIO:data.IDPROGRESOUSUARIO,
            }
          });
        },
        (error) => {
          this.presentCustomToast(error.error.error, "danger");
        }
      );
    }
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
  MessagePremium(){
    this.presentCustomToast('Ejercicio Premium, Suscribase para acceder a ellos','warning');
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
        if(this.userSesionPerfil[0].NOTIFICACIONUSUARIO){
          this.scheduleNotification();
        }
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
        this.dataTEjercicio = this.dataLikeTEjercicio.map(bookmark => {
          const matchingRutina = this.dataTEjercicio.find(rutina => rutina.IDTIPOEJERCICIO  === bookmark.IDTIPOEJERCICIO);
          return matchingRutina;
        });
        //this.dataTEjercicio = this.dataTEjercicio.filter((element) => this.LikeTEjercicioState[element.IDTIPOEJERCICIO]);
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
        this.dataOPersoales = this.dataLikeOPersonal.map(bookmark => {
          const matchingRutina = this.dataOPersoales.find(rutina => rutina.IDOBJETIVOSPERSONALES === bookmark.IDOBJETIVOSPERSONALES);
          return matchingRutina;
        });
        //this.dataOPersoales = this.dataOPersoales.filter((element) => this.LikeOPersonalState[element.IDOBJETIVOSPERSONALES]);
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
        if (this.dataLikeOMuscular) {
          this.dataOMusculares = this.dataLikeOMuscular.map(bookmark => {
            const matchingRutina = this.dataOMusculares.find(rutina => rutina.IDOBJETIVOSMUSCULARES === bookmark.IDOBJETIVOSMUSCULARES);
            return matchingRutina;
          });
        }
        //this.dataOMusculares = this.dataOMusculares.filter((element) => this.LikeOMuscularState[element.IDOBJETIVOSMUSCULARES]);
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
        if (this.dataBookMarkRutinas) {
          this.dataRutinas = this.dataBookMarkRutinas.map(bookmark => {
            const matchingRutina = this.dataRutinas.find(rutina => rutina.IDRUTINA === bookmark.IDRUTINA);
            return matchingRutina;
          });
        }
        try {
          if (this.dataEntrenadorUsuarios &&  this.dataRutinasTotal && this.dataRutinasTotal.length>0) {
            this.dataRutinasTotal = this.dataRutinasTotal.filter(elemento =>{
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
          this.presentCustomToast('Error en Mostrar Rutinas','danger');
        }
        //this.dataRutinas = this.dataRutinas.filter((element) => this.bookmarkRutinasState[element.IDRUTINA]);
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
        this.dataSesiones = this.dataBookMarkSesiones.map(bookmark => {
          const matchingRutina = this.dataSesiones.find(rutina => rutina.IDSESION === bookmark.IDSESION);
          return matchingRutina;
        });
        //this.dataSesiones = this.dataSesiones.filter((element) => this.bookmarkSesionesState[element.IDSESION]);
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
          this.cargarImagenesBefores();
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
        if (this.dataBookMark) {
          this.dataEjercicio = this.dataBookMark.map(bookmark => {
            const matchingRutina = this.dataEjercicio.find(rutina => rutina.IDEJERCICIO === bookmark.IDEJERCICIO);
            return matchingRutina;
          });
        }
        //this.dataEjercicio = this.dataEjercicio.filter((element) => this.bookmarkState[element.IDEJERCICIO]);
      },
      (error) => {
        this.presentCustomToast(error.error.error,"danger");
      }
    );
  }

  obtenerEjerciciosidEjercicio(idEjercicio: number): Observable<any> {
    return this.apiService.getEjercicioActivateIdEjercicio(idEjercicio);
  }

  obtenerRutinasidRutina(idRutina: number): Observable<any> {
    return this.apiService.getRutinasActivateIdRutinas(idRutina);
  }

  obtenerSesionesidSesion(idSesion: number): Observable<any> {
    return this.apiService.getSesionesActivateidSesion(idSesion);
  }


  changeShowProgresoUsuario(idprogresoUsuario: number){
    this.apiService.changeShowProgresoUsuario(idprogresoUsuario,0).subscribe(
      (response) => {
        this.presentCustomToast(response.message,"success");
      },
      (error) => {
        this.presentCustomToast(error.error.error,"danger");
      }
    );
  }

  obtenerProgresousuario(){
    this.apiService.obtenerProgresousuario(this.userSesionPerfil[0].IDUSUARIO).subscribe(
      (response) => {
        this.dataprocesosQuedados=response;
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
  async obtenercontarTypes(nameTable:string): Promise<any[]>{
    try {
      const response = await this.apiService.obtenercontarTypes(nameTable).toPromise();
      return response;
    } catch (error) {
      this.presentCustomToast("Sin Registro", "danger");
      throw error;
    }
  }
}
