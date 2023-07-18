import { Component, OnInit } from '@angular/core';
import { StatusBar } from '@capacitor/status-bar';
import { Storage } from '@ionic/storage-angular';
import { IP_ADDRESS } from '../../../constantes';
import { ApiServiceService } from '../../../api-service.service';
import { NavController, ToastController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-rutinas-diarias',
  templateUrl: './rutinas-diarias.page.html',
  styleUrls: ['./rutinas-diarias.page.scss'],
})
export class RutinasDiariasPage implements OnInit {
  public ip_address = IP_ADDRESS;

  public userSesion!:string;
  public userSesionPerfil!:any;
  public loading = true;

  public dataEjercicio!: any[];

  contador: number = 0;
  CALORIASEJERCICIOTOTAL:number=0;
  VALIDATORCALORIASEJERCICIOTOTAL:boolean=false;

  variable!:any;
  previusPageMain:boolean=false;
  previusPagelistarGuardados:boolean=false;
  public variableSesion!:any;

  bookmarkState: { [key: number]: boolean } = {};
  dataBookMark!:any[];

  bookmarkRutinasState: { [key: number]: boolean } = {};
  dataBookMarkRutinas!:any[];
  previusPagelistarRutinasAll!:any;

  squareWidth: number = 300; // Ancho del cuadrado
  circleRadius: number = 25; // Radio del círculo
  circleX: number = this.circleRadius; // Inicialmente en el centro del cuadrado
  circleY: number = this.squareWidth / 2; // Inicialmente en el centro del cuadrado

  dataEntrenadorUsuarios!:any[];

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
      this.obtenerContratoEntrenadoresUsuario();
      this.obtenerbookmarkrutinas();
      this.obtenerBookMarkUser();
      this.loading=false;
    }
    recuperarDatos(){
      this.route.queryParams.subscribe(params => {
        this.variable = params['variableRutinaDiaria'] as any;
        this.variableSesion = params['variableSesiones'] as any;
        this.previusPageMain = params['previusPageMain'] as boolean|| false;
        this.previusPagelistarGuardados = params['previusPagelistarGuardados'] as boolean|| false;
        this.previusPagelistarRutinasAll= params['previusPagelistarRutinasAll'] as any || null;
      });
      this.variable.DURACIONRUTINA =this.formatDuracionRutina(this.variable.DURACIONRUTINA);
    }
    goEjercicioUniq(itemName:any,name:string){
      const elementoEncontrado = this.dataEjercicio.find(item => item.IDEJERCICIO === itemName);
      this.dataBookMark=[];
      this.navController.navigateForward('/' + name, {
        queryParams: {
          previusPagelistarRutinasAll:this.previusPagelistarRutinasAll,
          variableEjercicio:elementoEncontrado,
          variableRutinaDiaria:this.variable,
          variableSesiones:this.variableSesion,
          previusPageMain :this.previusPageMain,
          previusPagelistarGuardados:this.previusPagelistarGuardados,
        }
      });
    }
    sumarCaloriasEjercicio() {
      if (!this.VALIDATORCALORIASEJERCICIOTOTAL) {
        for (let i = 0; i < this.variable.IDEJERCICIOS.length; i++) {
          const ejercicio = this.findEjercicioRutina(this.variable.IDEJERCICIOS[i]);
          if (ejercicio !== null) {
            this.CALORIASEJERCICIOTOTAL += parseFloat(ejercicio.CALORIASEJERCICIO);
          }
        }
        this.VALIDATORCALORIASEJERCICIOTOTAL = true;
      }
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
                this.obtenerContratoEntrenadoresUsuario();
                //this.obtenerEjercicios();
                //this.loading=true;
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
      const rutinas = this.dataEjercicio;
      const imageUrls = [];
      if (Array.isArray(rutinas)) {
        for (let i = 0; i < rutinas.length; i++) {
          const nameImagen = this.getVideoName(rutinas[i].ALMACENAMIENTOMULTIMEDIA);
          const imageUrl = this.ip_address+'/multimedia/'+nameImagen+'.jpg';
          imageUrls.push(imageUrl);
        }
      }
      const imageUrl = this.ip_address+'/media/rutinas/portadasrutinas/'+this.variable.IMAGENRUTINA;
      imageUrls.push(imageUrl);
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
    go_page(name: string) {
      this.CALORIASEJERCICIOTOTAL=0;
      this.VALIDATORCALORIASEJERCICIOTOTAL=false;
      this.navController.navigateForward('/' + name, {
        queryParams: {
          variableSesiones: this.variableSesion,
          previusPageMain : this.previusPageMain,
          previusPagelistarGuardados : this.previusPagelistarGuardados,
        }
      });
    }
    onTouchMove(event: TouchEvent) {
      const touch = event.touches[0];
      const newPositionX = touch.clientX - this.circleRadius; // Restar el radio para ajustar la posición
      this.updateCirclePosition(newPositionX, this.circleY);
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
      setTimeout(() => {
        this.loading=false;
      }, 500);
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
          const elementoEncontrado = this.dataEjercicio.find(item => item.IDEJERCICIO === this.variable.IDEJERCICIOS[0]);
          this.navController.navigateForward('/ejercicio-uniq' , {
            queryParams: {
              variableEjercicio:elementoEncontrado,
              variableEjercicios:this.variable.IDEJERCICIOS,
              variableEjerciciositem:0,
              variableRutinaDiaria:this.variable,
              variableSesiones:this.variableSesion,
              previusPageMain :this.previusPageMain,
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

    incrementarContador(): void {
      this.contador++;
    }
    getVideoName(url: string): string {
      if (url) {
        return url.split('.')[0];
      }
      return '';
    }
    findEjercicioRutina(IDEJERCICIORUTINA: number): any {
      if (this.dataEjercicio) {
        const elemento = this.dataEjercicio.find(objeto => objeto.IDEJERCICIO === IDEJERCICIORUTINA);
        return elemento;
      }
      return null;
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

    obtenerEjercicios(){
      this.apiService.getEjercicioActivate().subscribe(
        (response) => {
          this.dataEjercicio=response;
          this.dataEjercicio.forEach((ejercicio) => {
          ejercicio.CALORIASEJERCICIO= (this.obtenerDuracionEnMinutos(ejercicio.TIEMPOMULTIMEDIA)/60*ejercicio.METEJERCICIO*Number(this.userSesionPerfil[0].PESOUSUARIO)).toFixed(2);
          });
          try {
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
            }
          } catch (error) {
            this.presentCustomToast('Error en Mostrar Ejercicios','danger');

          }
          this.obtenerbookmarkrutinas();
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


    obtenerBookMarkUser(){
      this.apiService.allBookmark('bookmarkpersona').subscribe(
        (response) => {
          this.dataBookMark=response;
          this.dataBookMark= this.dataBookMark.filter(element=>element.IDPERSONA ===this.userSesionPerfil[0].IDPERSONA)
          this.dataBookMark.forEach(bookmark => {
            this.bookmarkState[bookmark.IDEJERCICIO] = true;
          });
          this.sumarCaloriasEjercicio();
          this.cargarImagenesBefores();
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
          this.obtenerBookMarkUser();
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
