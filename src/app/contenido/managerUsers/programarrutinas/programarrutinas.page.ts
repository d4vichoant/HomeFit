import { Component, OnInit } from '@angular/core';
import { StatusBar } from '@capacitor/status-bar';
import { Storage } from '@ionic/storage-angular';
import { IP_ADDRESS } from '../../../constantes';
import { ApiServiceService } from '../../../api-service.service';
import { NavController, ToastController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-programarrutinas',
  templateUrl: './programarrutinas.page.html',
  styleUrls: ['./programarrutinas.page.scss'],
})
export class ProgramarrutinasPage implements OnInit {
  public ip_address = IP_ADDRESS;

  public userSesion!:string;
  public userSesionPerfil!:any;
  public loading = true;


  public dataRutinas!:any[];
  public dataEjercicio!:any[];

  variable!:any;
  previusPageMain:boolean=false;
  private variableSesion!:any;

  visibilidadContenedores: { [key: number]: boolean } = {};

  bookmarkState: { [key: number]: boolean } = {};
  dataBookMark!:any[];

  DuracionTotal!:string;

  bookmarkSesionesState: { [key: number]: boolean } = {};
  dataBookMarkSesiones!:any[];

  constructor(private navController: NavController,
    private route: ActivatedRoute,
    private apiService: ApiServiceService,
    private storage: Storage,
    public toastController: ToastController) { }

  ngOnInit() {
    try {
      this.recuperarDatos();
      this.validateSesion();
      //this.test();
    } catch (error) {
      this.handleError();
    }
  }
  ionViewDidEnter() {
    try {
      this.recuperarDatos();
      this.validateSesion();
      //this.test();
    } catch (error) {
      this.handleError();
    }
  }
  test(){
    this.chanceColorFooter();
    this.StatusBar();
    this.obtenerbookmarksesiones();
    this.obtenerBookMarkUser();
    this.obtenerEjercicios();
    this.obtenerRutinas();
    this.loading=false;
  }
  recuperarDatos(){
    this.route.queryParams.subscribe(params => {
      this.variable = params['variableRutinaDiaria'] as any;
      this.variableSesion = params['variableSesiones'] as any;
      this.previusPageMain = params['previusPageMain'] as boolean|| false;
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
              this.obtenerbookmarksesiones();
              this.obtenerBookMarkUser();
              this.obtenerEjercicios();
              this.obtenerRutinas();
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
    document.documentElement.style.setProperty('--activate-foot10',' transparent');
    document.documentElement.style.setProperty('--activate-foot11',' #6b6a6b');
    document.documentElement.style.setProperty('--activate-foot20',' #9259f9');
    document.documentElement.style.setProperty('--activate-foot21',' #9259f9');
    document.documentElement.style.setProperty('--activate-foot30',' transparent');
    document.documentElement.style.setProperty('--activate-foot31',' #6b6a6b');
    document.documentElement.style.setProperty('--activate-foot40',' transparent');
    document.documentElement.style.setProperty('--activate-foot41',' #6b6a6b');
  }

  toggleBookmarkOSesiones(index: number): void {
    if (this.bookmarkSesionesState[index]) {
      this.bookmarkSesionesState[index] = false;
      this.updateLikeTEjercicio(index,this.bookmarkSesionesState[index],'bookmarksesiones');
    } else {
      this.bookmarkSesionesState[index] = true;
      this.updateLikeTEjercicio(index,this.bookmarkSesionesState[index],'bookmarksesiones');
    }
  }

  go_page(name: string) {
    this.DuracionTotal="";
    this.navController.navigateForward('/' + name, {
      queryParams: {
        variableSesiones: this.variableSesion
      }
    });
  }

  toggleVisibilidadContenedor(indice: number) {
    this.visibilidadContenedores[indice] = !this.visibilidadContenedores[indice];
  }
  getVideoName(url: string): string {
    if (url) {
      return url.split('.')[0];
    }
    return '';
  }
  encontrarNumerosRepetidos(array: number[]): { number: number, count: number }[] {
    const conteoRepeticiones: { [num: number]: number } = {};

    // Iterar sobre el array y contar las repeticiones
    array.forEach((num) => {
      if (conteoRepeticiones[num]) {
        conteoRepeticiones[num]++;
      } else {
        conteoRepeticiones[num] = 1;
      }
    });

    // Encontrar la máxima cantidad de repeticiones
    let maxRepeticiones = 0;

    for (const num in conteoRepeticiones) {
      if (conteoRepeticiones[num] > maxRepeticiones) {
        maxRepeticiones = conteoRepeticiones[num];
      }
    }

    // Obtener los números que se repiten la máxima cantidad de veces
    const numerosRepetidos: { number: number, count: number }[] = [];

    for (const num in conteoRepeticiones) {
      if (conteoRepeticiones[num] === maxRepeticiones) {
        numerosRepetidos.push({ number: parseInt(num), count: maxRepeticiones });
      }
    }

    return numerosRepetidos;
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

  findEjercicioRutina(IDEJERCICIORUTINA: number): any {
    if (this.dataEjercicio) {
      const elemento = this.dataEjercicio.find(objeto => objeto.IDEJERCICIO === IDEJERCICIORUTINA);
      return elemento;
    }
    return null;
  }
  sumarTiempos(tiempo1:string, tiempo2:string):string {
    if (!tiempo1){
      tiempo1="00:00:00";
    }
    const msTiempo1 = this.tiempoToMilliseconds(tiempo1);
    const msTiempo2 = this.tiempoToMilliseconds(tiempo2);
    const suma = msTiempo1 + msTiempo2;
    const tiempoSuma = this.millisecondsToTiempo(suma);
    return tiempoSuma;
  }
  tiempoToMilliseconds(tiempo:string) {
    const partes = tiempo.split(':');
    const horas = parseInt(partes[0], 10);
    const minutos = parseInt(partes[1], 10);
    const segundos = parseInt(partes[2], 10);

    return horas * 3600000 + minutos * 60000 + segundos * 1000;
  }

  millisecondsToTiempo(ms:number) {
    const horas = Math.floor(ms / 3600000);
    const minutos = Math.floor((ms % 3600000) / 60000);
    const segundos = Math.floor((ms % 60000) / 1000);

    return this.pad(horas) + ':' + this.pad(minutos) + ':' + this.pad(segundos);
  }
  pad(valor: number | string): string {
    return valor.toString().padStart(2, '0'); // Agrega ceros a la izquierda si el valor es menor que 10
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
  obtenerDuracionEnMinutos(tiempo:string):number {
    const tiempoPartes = tiempo.split(":");
    const horas = parseInt(tiempoPartes[0]);
    const minutos = parseInt(tiempoPartes[1]);
    const segundos = parseInt(tiempoPartes[2]);

    const duracionMinutos = horas * 60 + minutos + segundos / 60;

    return parseFloat(duracionMinutos.toFixed(4));
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
  obtenerRutinas(){
    this.apiService.getRutinasActivate().subscribe(
      (response) => {
        this.dataRutinas=response;
        this.dataRutinas = this.dataRutinas.map(objeto => ({
          ...objeto,
          IDEJERCICIOS: objeto.IDEJERCICIOS.split(",").map(Number)
        }));
        if(this.variable){
          this.dataRutinas = this.variable.IDRUTINAS.map((IDRUTINAS: number) => this.dataRutinas.find(rutina => rutina.IDRUTINA === IDRUTINAS));
        }
        this.dataRutinas.forEach(element => {
          this.DuracionTotal = this.sumarTiempos(this.DuracionTotal,element.DURACIONRUTINA);
          element.IDEJERCICIOS.forEach((elementejercicio:number)=> {
            if(!element.CALORIARUTINA){
              element.CALORIARUTINA=0;
            }
            element.CALORIARUTINA +=parseFloat(this.findEjercicioRutina(elementejercicio).CALORIASEJERCICIO);
            let numero: number = parseFloat(element.CALORIARUTINA );
            let numeroConDecimales: number = parseFloat(numero.toFixed(2));
            element.CALORIARUTINA=numeroConDecimales;
          });
        });
        this.DuracionTotal=this.formatDuracionRutina(this.DuracionTotal);
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
