import { Component, OnInit } from '@angular/core';
import { StatusBar, StatusBarStyle } from '@capacitor/status-bar';
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

  dataEntrenadorUsuarios!:any[];

  public dataRutinas!:any[];
  public dataEjercicio!:any[];

  variable!:any;
  previusPageMain:boolean=false;
  previusPagelistarGuardados:boolean=false;
  public variableSesion!:any;

  previusPagelistarSesionesRutinasAll!:any;

  visibilidadContenedores: { [key: number]: boolean } = {};

  bookmarkState: { [key: number]: boolean } = {};
  dataBookMark!:any[];

  DuracionTotal!:string;
  VALIDATORDURACIONTOTAL:boolean=false;

  bookmarkSesionesState: { [key: number]: boolean } = {};
  dataBookMarkSesiones!:any[];

  squareWidth: number = 300; // Ancho del cuadrado
  circleRadius: number = 25; // Radio del círculo
  circleX: number = this.circleRadius; // Inicialmente en el centro del cuadrado
  circleY: number = this.squareWidth / 2; // Inicialmente en

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
    //this.chanceColorFooter();
    this.StatusBar();
    this.obtenerbookmarksesiones();
    this.obtenerBookMarkUser();
    this.obtenerEjercicios();
    this.obtenerRutinas();
    this.loading=false;
  }
  recuperarDatos(){
    this.route.queryParams.subscribe(params => {
      this.variable = params['variableprogramarrutinas'] as any;
      this.variableSesion = params['variableSesiones'] as any;

      this.previusPageMain = params['previusPageMain'] as boolean|| false;
      this.previusPagelistarGuardados = params['previusPagelistarGuardados'] as boolean|| false;
      this.previusPagelistarSesionesRutinasAll= params['previusPagelistarSesionesRutinasAll'] as any || null;;
    });
  }
  goEjercicioUniq(itemName:any,name:string,indexVariable:number,idEjercicios:any,Rutina:any,IDRutina:number){
    const elementoEncontrado = this.dataEjercicio.find(item => item.IDEJERCICIO === itemName);
    this.dataBookMark=[];
    this.navController.navigateForward('/' + name, {
      queryParams: {
        variableEjercicio:elementoEncontrado,
        variableEjercicios: idEjercicios,
        variableEjerciciositem:indexVariable,

        variableprogramarrutinas: this.variable,
        variableRutinas:this.variable.IDRUTINAS,
        variableRutinasitem:IDRutina,

        variableRutinaDiaria:Rutina,
        variableSesiones:this.variableSesion,

        previusPageMain :this.previusPageMain,
        previusPagelistarSesionesRutinasAll:this.previusPagelistarSesionesRutinasAll,
        previusPagelistarGuardados:this.previusPagelistarGuardados,
      }
    });
  }
  StatusBar(){
    StatusBar.setOverlaysWebView({ overlay: true });
    StatusBar.setBackgroundColor({color:'transparent'});
    StatusBar.setStyle({ style: StatusBarStyle.Light });
  }
  validateSesion(){
    try{
      this.storage.get('sesion').then((sesion) => {
        if (sesion && JSON.parse(sesion).rolUsuario == 1) {
          this.userSesion = JSON.parse(sesion).nickname;
          this.obtenerGetPerfilCompleto(this.userSesion);
          this.apiService.protectedRequestWithToken(JSON.parse(sesion).token).subscribe(
            (response) => {
              this.StatusBar();
              this.obtenerbookmarksesiones();
              this.obtenerBookMarkUser();
              this.obtenerContratoEntrenadoresUsuario();
              /* this.obtenerEjercicios();
              this.obtenerRutinas(); */
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


  toggleBookmarkOSesiones(index: number): void {
    this.loading=true;
    if (this.bookmarkSesionesState[index]) {
      this.bookmarkSesionesState[index] = false;
      this.updateLikeTEjercicio(index,this.bookmarkSesionesState[index],'bookmarksesiones');
    } else {
      this.bookmarkSesionesState[index] = true;
      this.updateLikeTEjercicio(index,this.bookmarkSesionesState[index],'bookmarksesiones');
    }
    setTimeout(() => {
      this.loading=false;
    }, 500);
  }

  go_page(name: string) {
    this.DuracionTotal="";
    this.VALIDATORDURACIONTOTAL=false;
    this.navController.navigateForward('/' + name, {
      queryParams: {
        variableSesiones: this.variableSesion,
        previusPageMain : this.previusPageMain,
        previusPagelistarGuardados : this.previusPagelistarGuardados,
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
    this.loading=true;
    if (this.bookmarkState[index]) {
      this.bookmarkState[index] = false;
      this.updateBookMarkUser(index,this.bookmarkState[index]);
    } else {
      this.bookmarkState[index] = true;
      this.updateBookMarkUser(index,this.bookmarkState[index]);
    }
    setTimeout(() => {
      this.loading=false;
    }, 500);
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

  onTouchMove(event: TouchEvent) {
    const touch = event.touches[0];
    const newPositionX = touch.clientX - this.circleRadius; // Restar el radio para ajustar la posición
    this.updateCirclePosition(newPositionX, this.circleY);
  }

  private updateCirclePosition(x: number, y: number) {
    // Restringir el movimiento dentro del cuadrado
    if (x < this.circleRadius) {
      this.circleX = this.circleRadius;
    } else if (x > this.squareWidth - this.circleRadius) {
      this.circleX = this.squareWidth - this.circleRadius;
    } else {
      this.circleX = x;
    }
    this.circleY = y;
    if(this.circleX===this.squareWidth-this.circleRadius){
      setTimeout(() => {
        this.dataBookMark=[];
        const elementoEncontradoRutina =  this.dataRutinas.find((elemento) => elemento.IDRUTINA === this.variable.IDRUTINAS[0]);
        const elementoEncontrado = this.dataEjercicio.find(item => item.IDEJERCICIO === elementoEncontradoRutina.IDEJERCICIOS[0]);
        this.navController.navigateForward('/ejercicio-uniq' , {
          queryParams: {
            variableEjercicio:elementoEncontrado,
            variableEjercicios:elementoEncontradoRutina.IDEJERCICIOS,
            variableEjerciciositem:0,

            variableprogramarrutinas:this.variable,
            variableRutinas:this.variable.IDRUTINAS,
            variableRutinasitem:0,

            variableRutinaDiaria:elementoEncontradoRutina,
            variableSesiones:this.variableSesion,

            previusPageMain :this.previusPageMain,
            previusPagelistarSesionesRutinasAll:this.previusPagelistarSesionesRutinasAll,
            previusPagelistarGuardados:this.previusPagelistarGuardados,

          }
        });
      }, 150);
    }
  }
  onTouchEnd() {
    const squareCenter = this.squareWidth / 2;
    if (this.circleX < squareCenter) {
      this.updateCirclePosition(0, this.circleY);
    } else {
      this.updateCirclePosition(this.squareWidth - this.circleRadius, this.circleY);
    }
    setTimeout(()=>{
      this.updateCirclePosition(0, this.circleY);
    },400);
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
        let duracionTotal!: string;
        this.dataRutinas.forEach(element => {
          duracionTotal= this.sumarTiempos(duracionTotal,element.DURACIONRUTINA);
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
        if(!this.VALIDATORDURACIONTOTAL){
          this.VALIDATORDURACIONTOTAL=true;
          this.DuracionTotal=duracionTotal;
          this.DuracionTotal=this.formatDuracionRutina(this.DuracionTotal);
          }
          try {
            if (this.dataEntrenadorUsuarios && this.dataRutinas && this.dataRutinas.length>0) {
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
            }
          } catch (error) {
            this.presentCustomToast('Error en Mostrar Rutinas','danger');
          }

          if (this.dataEntrenadorUsuarios && this.dataRutinas && this.dataRutinas.length>0){
          this.dataRutinas.sort((a, b) => {
            const premierOrder: { [key: string]: number } = {
              Suscripto: 0,
              Gratis: 1,
              Premium: 2,
            };
            const premierA = premierOrder[a.PREMIER];
            const premierB = premierOrder[b.PREMIER];
            return premierA - premierB;
          });
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
        this.dataEjercicio.forEach((ejercicio) => {
          ejercicio.CALORIASEJERCICIO= (this.obtenerDuracionEnMinutos(ejercicio.TIEMPOMULTIMEDIA)/60*ejercicio.METEJERCICIO*Number(this.userSesionPerfil[0].PESOUSUARIO)).toFixed(2);
          });
          try {
            if (this.dataEntrenadorUsuarios && this.dataEjercicio && this.dataEjercicio.length>0) {
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

        //this.obtenerEjercicios();
        this.obtenerRutinas();
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
