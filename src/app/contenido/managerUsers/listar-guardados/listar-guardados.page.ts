import { Component, OnInit } from '@angular/core';
import { IP_ADDRESS } from '../../../constantes';
import { NavController, ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { ApiServiceService } from '../../../api-service.service';
import { StatusBar, StatusBarStyle } from '@capacitor/status-bar';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-listar-guardados',
  templateUrl: './listar-guardados.page.html',
  styleUrls: ['./listar-guardados.page.scss'],
})
export class ListarGuardadosPage implements OnInit {
  public ip_address = IP_ADDRESS;

  public userSesion!:string;
  public userSesionPerfil!:any;
  public loading = true;

  dataEntrenadorUsuarios!:any[];

  public dataRutinas!: any[];
  public dataSesiones!:any[];
  public dataOPersoales!: any[];
  public dataTEjercicio!: any[];
  public dataOMusculares!: any[];
  public dataEjercicio!: any[];

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

  currentDate!: string;
  previusPagePerfile:boolean=false;
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
    //this.test();
  }
  ionViewDidEnter() {
    this.recuperarDatos();
    this.validateSesion();
    //this.test();f
  }
  StatusBar(){
    StatusBar.setOverlaysWebView({ overlay: true });
    StatusBar.setBackgroundColor({color:'transparent'});
    StatusBar.setStyle({ style: StatusBarStyle.Dark });
  }

  recuperarDatos(){
    this.route.queryParams.subscribe(params => {
      this.previusPagePerfile = params['previusPagePerfile'] as any;
    });
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
              this.updateCurrentDate();
              this.obtenerContratoEntrenadoresUsuario();
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
              this.obtenerTEjercicios()
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
    this.navController.navigateForward('/error-page-users-trainers');
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
  cargarImagenesBefores(){
    const imageUrls = [];
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

    let imagesLoaded = 0;
    const totalImages = imageUrls.length;
    //console.log(imageUrls);
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
  MessagePremium(){
    this.presentCustomToast('Ejercicio Premium, Suscribase para acceder a ellos','warning');
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
  selectSwiper(item:any,page:string){
    this.go_page_create(page,item);
  }
  go_page_create(name: string, data: any) {
    if(name!== 'listar-sesiones'){
      this.navController.navigateForward('/' + name, {
        queryParams: {
          variableParametro: data,
          previusPagelistarGuardados:true,
        }
      });
    }else{
      this.navController.navigateForward('/' + name, {
        queryParams: {
          variableSesiones: data,
          previusPagelistarGuardados:true,
        }
      });
    }
  }
  goEjercicioUniq(itemName:any,name:string){
    this.dataBookMark=[];
    this.navController.navigateForward('/' + name, {
      queryParams: {
        variableEjercicio:itemName,
        previusPagelistarGuardados:true,
      }
    });
  }

  go_page_create_rutina(data: any,name: string) {
    if(name==='rutinas-diarias'){
      this.navController.navigateForward('/' + name, {
        queryParams: {
          variableRutinaDiaria: data,
          previusPagelistarGuardados:true,
        }
      });
    }else if (name==='programarrutinas'){
      this.navController.navigateForward('/' + name, {
        queryParams: {
          variableprogramarrutinas: data,
          previusPagelistarGuardados:true,
        }
      });
    }
  }
  getVideoName(url: string): string {
    return url.split('.')[0];
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
  go_page(name: string){
    //this.router.navigate(['/'+name], { state: { previousPage: 'crear-ejercicio' } });
    this.navController.navigateForward('/'+name);
  }
  go_pageback(){
    if(this.previusPagePerfile){
        const name='perfile';
        this.navController.navigateForward('/'+name);
      }
      else{
        const name='main';
        this.navController.navigateForward('/'+name);
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
        this.dataTEjercicio = this.dataLikeTEjercicio.map(bookmark => {
          const matchingRutina = this.dataTEjercicio.find(rutina => rutina.IDTIPOEJERCICIO  === bookmark.IDTIPOEJERCICIO);
          return matchingRutina;
        });

        this.cargarImagenesBefores();

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
        this.dataOMusculares = this.dataLikeOMuscular.map(bookmark => {
          const matchingRutina = this.dataOMusculares.find(rutina => rutina.IDOBJETIVOSMUSCULARES === bookmark.IDOBJETIVOSMUSCULARES);
          return matchingRutina;
        });

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
        this.dataRutinas = this.dataRutinas.map(objeto => ({
          ...objeto,
          IDEJERCICIOS: objeto.IDEJERCICIOS.split(",").map(Number)
        }));
        this.dataRutinas = this.dataBookMarkRutinas.map(bookmark => {
          const matchingRutina = this.dataRutinas.find(rutina => rutina.IDRUTINA === bookmark.IDRUTINA);
          return matchingRutina;
        });
        if (this.dataEntrenadorUsuarios && this.dataEntrenadorUsuarios.length > 0 && this.dataRutinas && this.dataRutinas.length>0) {
          this.dataRutinas = this.dataRutinas.filter(elemento =>{
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
        } else {
          this.presentCustomToast('Error en Mostrar Rutinas','danger');
          //console.log('this.dataEntrenadorUsuarios no está definido o no contiene elementos.');
        }
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

        if (this.dataEntrenadorUsuarios && this.dataEntrenadorUsuarios.length > 0 && this.dataSesiones.length && this.dataSesiones) {
          this.dataSesiones = this.dataSesiones.filter(elemento =>{
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
        } else {
          this.presentCustomToast('Error en Mostrar Sesiones','danger');
          //console.log('this.dataEntrenadorUsuarios no está definido o no contiene elementos.');
        }

        //this.dataSesiones = this.dataSesiones.filter((element) => this.bookmarkSesionesState[element.IDSESION]);
      },
      (error) => {
        this.presentCustomToast(error.error.error,"danger");
      }
    );
  }
  obtenerEjercicios() {
    this.apiService.getEjercicioActivate().subscribe(
      (response) => {
        this.dataEjercicio = response;
        this.dataEjercicio = this.dataBookMark.map(bookmark => {
          const matchingRutina = this.dataEjercicio.find(rutina => rutina.IDEJERCICIO === bookmark.IDEJERCICIO);
          return matchingRutina;
        });
        if (this.dataEntrenadorUsuarios && this.dataEntrenadorUsuarios.length > 0 && this.dataEjercicio && this.dataEjercicio.length>0) {
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
        } else {
          this.presentCustomToast('Error en Mostrar Ejercicios','danger');
          //console.log('this.dataEntrenadorUsuarios no está definido o no contiene elementos.');
        }
      },
      (error) => {
        this.presentCustomToast(error.error.error, "danger");
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
}
