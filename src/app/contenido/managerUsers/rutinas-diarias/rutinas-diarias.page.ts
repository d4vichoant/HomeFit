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

  variable!:any;
  private variableSesion!:any;
  isFilled = false;

  bookmarkState: { [key: number]: boolean } = {};
  dataBookMark!:any[];

  squareWidth: number = 300; // Ancho del cuadrado
  circleRadius: number = 25; // Radio del círculo
  circleX: number = this.circleRadius; // Inicialmente en el centro del cuadrado
  circleY: number = this.squareWidth / 2; // Inicialmente en el centro del cuadrado

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
      this.obtenerEjercicios();
      this.obtenerBookMarkUser();
      this.loading=false;
    }
    recuperarDatos(){
      this.route.queryParams.subscribe(params => {
        this.variable = params['variableRutinaDiaria'] as any;
        this.variableSesion = params['variableSesiones'] as any;
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
                this.obtenerEjercicios();
                this.obtenerBookMarkUser();
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
      console.log("ASDasd");
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
    go_page(name: string) {
      this.navController.navigateForward('/' + name, {
        queryParams: {
          variableSesiones: this.variableSesion
        }
      });
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
        this.go_page('programarrutinas');
      }
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
      return null; // O devuelve un valor predeterminado en caso de que 'this.dataEjercicio' sea 'undefined'
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
