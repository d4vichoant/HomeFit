import { Component, OnInit } from '@angular/core';
import { IP_ADDRESS } from '../../../constantes';
import { ApiServiceService } from '../../../api-service.service';
import { Storage } from '@ionic/storage-angular';
import { AlertController, NavController, ToastController } from '@ionic/angular';
import { StatusBar } from '@capacitor/status-bar';

@Component({
  selector: 'app-sesiones',
  templateUrl: './sesiones.page.html',
  styleUrls: ['./sesiones.page.scss'],
})
export class SesionesPage implements OnInit {
  public ip_address = IP_ADDRESS;
  public loading = true;
  public userSesion!:string;
  public userSesionPerfil!:any;
  public searchTerm!:string;
  private previousSearchTerm: string = '';
  selectedItem: number = -1;

  public dataSesionesUniq!:any[];
  public origindata!:any[];

  public dataSesiones!:any[];
  public dataRutinas!:any[];

  mostraRutinasSelect: boolean[] = [];

  constructor(private storage: Storage,
    private apiService: ApiServiceService,
    public toastController: ToastController,
    private navController: NavController,
    public alertController: AlertController) { }

    ngOnInit() {
      this.chanceColorFooter();
      this.validateSesion();
      //this.test();
      //this.cargarImagenesBefore();
    }
    ionViewDidEnter() {
      //this.test();
      this.chanceColorFooter();
      this.validateSesion();
      //this.cargarImagenesBefore();
    }
    private chanceColorFooter(){
      document.documentElement.style.setProperty('--activate-foot10',' transparent');
      document.documentElement.style.setProperty('--activate-foot11',' #6b6a6b');
      document.documentElement.style.setProperty('--activate-foot20','transparent');
      document.documentElement.style.setProperty('--activate-foot21',' #6b6a6b');
      document.documentElement.style.setProperty('--activate-foot30',' #9259f9');
      document.documentElement.style.setProperty('--activate-foot31',' #9259f9');
      document.documentElement.style.setProperty('--activate-foot40',' transparent');
      document.documentElement.style.setProperty('--activate-foot41',' #6b6a6b');
    }
    cargarImagenesBefore(){
      const rutinas = this.dataRutinas; // Obtén el array de ejercicios
      const imageUrls = []; // Array para almacenar las URL de las imágenes
      if (Array.isArray(rutinas)) {
        for (let i = 0; i < rutinas.length; i++) {
          const videoName = rutinas[i].IMAGENRUTINA;
          const imageUrl = this.ip_address+'/media/rutinas/portadasrutinas/'+videoName;
          imageUrls.push(imageUrl);
        }
      }
      const sesiones = this.dataSesiones; // Obtén el array de ejercicios
      if (Array.isArray(sesiones)) {
        for (let i = 0; i < sesiones.length; i++) {
          const videoName = sesiones[i].IMAGESESION;
          const imageUrl = this.ip_address+'/media/sesiones/portadassesiones/'+videoName;
          imageUrls.push(imageUrl);
        }
      }

      const imageUrlAdd = this.ip_address+'/media/sesiones/crear_sesion.jpg';
      imageUrls.push(imageUrlAdd);
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
    test(){
      this.StatusBar();
      this.obtenerSesiones();
      this.obtenerRutinas();
    }
    StatusBar(){
      StatusBar.hide();
      StatusBar.setOverlaysWebView({ overlay: true });
      StatusBar.setBackgroundColor({ color: '#ffffff' });
    }
    validateSesion(){
      try{
        this.storage.get('sesion').then((sesion) => {
          if (sesion && JSON.parse(sesion).rolUsuario == 99) {
            this.userSesion = JSON.parse(sesion).nickname;
            this.obtenerGetPerfilCompleto(this.userSesion);
            this.apiService.protectedRequestWithToken(JSON.parse(sesion).token).subscribe(
              (response) => {
                this.StatusBar();
                this.obtenerSesiones();
                this.obtenerRutinas();
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
      this.navController.navigateForward('/error-sesiones');
      this.storage.remove('sesion');
    }

    go_page_create(name: string, data: any) {
      this.navController.navigateForward('/' + name, {
        queryParams: {
          variableSesiones: data
        }
      });
    }

    go_page(name: string){
      //this.router.navigate(['/'+name], { state: { previousPage: 'crear-ejercicio' } });
      this.navController.navigateForward('/'+name);
    }

    async savecopy(data:any){
      console.log(data);
      const alert = await this.alertController.create({
        header: 'Confirmar Copia',
        message: '¿Estás seguro que desea realizar una Copia de esta Rutina?',
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
              data.ID_RUTINAS_SESION=data.IDRUTINAS.map((elemento:any) => elemento.toString()).join(',');
              data.USUARIOCREACIONSESION=this.userSesionPerfil[0].IDPERSONA;
              this.CreateData(data);
              this.enfocarenRutinasporSesion();
            }
          }
        ]
      });
      await alert.present();
    }
    public onInputChange(event: any) {
      const currentSearchTerm = event.target.value;
      if (currentSearchTerm.length < this.previousSearchTerm.length) {
        this.dataSesionesUniq=this.origindata;
        this.selectedItem = -1;
      }
      this.previousSearchTerm = currentSearchTerm;
      this.filterItems();
    }
    enfocarenRutinasporSesion(){
      const index=this.dataSesiones.length as number;
      setTimeout(() => {
        const elementoDestino = document.getElementById('elemento-sesiones' + (index ));
        if (elementoDestino) {
          elementoDestino.scrollIntoView({ behavior: 'smooth' });
        }
      }, 50);
    }

    async CreateData(data:any) {
      try {
        this.loading=true;
        const response = await this.apiService.CreteDataSesion(data).toPromise();
        this.loading=false;
        this.ngOnInit();
        this.presentCustomToast(response.message, "success");
      } catch (error:any) {
        this.presentCustomToast(error.error.errror, "danger");
      }
    }
    showEjerciciosxItem(data: any, index: number) {
      this.mostraRutinasSelect[index] = !this.mostraRutinasSelect[index];
      if (this.mostraRutinasSelect[index] ===true){
        setTimeout(() => {
          const elementoDestino = document.getElementById('elemento-destino-' + index);
          if (elementoDestino) {
            elementoDestino.scrollIntoView({ behavior: 'smooth' });
          }
        }, 50);
      }
    }
    findRutinasSesiones(IDEJERCICIORUTINA: number): any {
      const elemento = this.dataRutinas.find(objeto => objeto.IDRUTINA === IDEJERCICIORUTINA);
      return elemento;
    }
    getVideoName(url: string): string {
      return url.split('.')[0];
    }

    async confirmaractualizarEjercicioActivacion(data :any) {
      const alert = await this.alertController.create({
        header: 'Confirmar Estado',
        message: '¿Estás seguro de activar/desactivar esta Rutina?',
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
              if (data.STATUSSESION===0){
                data.STATUSSESION=1;
              }else{
                data.STATUSSESION=0;
              }
              this.actualizarEjercicioActivacion(data);
            }
          }
        ]
      });

      await alert.present();
    }

    actualizarEjercicioActivacion(data:any){
      this.apiService.UpdataStatus(data,"programarsesion").subscribe(
        (response) => {
          this.presentCustomToast(response.message,"success");
        },
        (error) => {
          this.presentCustomToast(error.error.error,"danger");
        }
      );
    }
    getArrayLength(array: any[]): number {
      return array.length;
    }

    private filterItems() {
      if (!this.origindata) {
        const rawData = this.dataSesionesUniq;
        this.origindata = rawData.map(item => ({ ...item }));
      }

      const searchTerms = this.searchTerm.toLowerCase().trim().split(' ');
      if (searchTerms.length >= 1) {
        let filteredArray: any[] = [];

        for (const term of searchTerms) {
          const filteredItems = this.dataSesionesUniq.filter(item =>
            item.NOMBRETIPOEJERCICIO.toLowerCase().includes(term) ||
            item.tituloniveldificultadejercicio.toLowerCase().includes(term) ||
            item.NOMBREEJERCICIO.toLowerCase().includes(term)
          );

          filteredArray = filteredArray.concat(filteredItems);
        }

        // Eliminar duplicados del array filtrado
        this.dataSesionesUniq = Array.from(new Set(filteredArray));
      }
    }

    async presentCustomToast(message: string, color: string) {
      const toast = await this.toastController.create({
        message: message,
        duration: 2400,
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

    obtenerSesiones(){
      this.apiService.getSesiones().subscribe(
        (response) => {
          this.dataSesiones=response;
          this.dataSesiones = this.dataSesiones.map(objeto => ({
            ...objeto,
            IDRUTINAS: objeto.IDRUTINAS.split(",").map(Number)
          }));
        },
        (error) => {
          this.presentCustomToast(error.error.error,"danger");
        }
      );
    }

    obtenerRutinas(){
      this.apiService.getRutinas().subscribe(
        (response) => {
          this.dataRutinas=response;
          setTimeout(() => {
            this.cargarImagenesBefore();
          }, 1000);
        },
        (error) => {
          this.presentCustomToast(error.error.error,"danger");
        }
      );
    }
}
