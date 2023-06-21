import { Component, OnInit,ViewChild } from '@angular/core';
import { IP_ADDRESS } from '../../../constantes';
import { ApiServiceService } from '../../../api-service.service';
import { ActivatedRoute,Router } from '@angular/router';
import { Storage } from '@ionic/storage-angular';
import { NavController, ToastController,IonContent } from '@ionic/angular';
import { StatusBar } from '@capacitor/status-bar';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-rutinas',
  templateUrl: './rutinas.page.html',
  styleUrls: ['./rutinas.page.scss'],
})
export class RutinasPage implements OnInit {
  @ViewChild(IonContent) content!: IonContent;
  public ip_address = IP_ADDRESS;
  public loading = true;
  public userSesion!:string;
  public userSesionPerfil!:any;
  public searchTerm!:string;
  private previousSearchTerm: string = '';
  //selectedItem: number = -1;

  //public dataRutinasUniq!:any[];
  public origindata!:any[];

  public dataRtuinas!:any[];
  public dataEjercicio!:any[];

  mostrarEjerciciosSelect: boolean[] = [];

  variabledata: any;

  constructor(private storage: Storage,
    private route: ActivatedRoute,
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
      this.chanceColorFooter();
      this.validateSesion();
      //this.test();
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
      const imageUrls = []; // Array para almacenar las URL de las imágenes
      if (Array.isArray(this.dataRtuinas)) {
        for (let i = 0; i < this.dataRtuinas.length; i++) {
          const videoName = this.dataRtuinas[i].IMAGENRUTINA;
          const imageUrl = this.ip_address+'/media/rutinas/portadasrutinas/'+videoName;
          imageUrls.push(imageUrl);
        }
      }
      if (Array.isArray(this.dataEjercicio)) {
        for (let i = 0; i < this.dataEjercicio.length; i++) {
          const videoName = this.getVideoName(this.dataEjercicio[i].ALMACENAMIENTOMULTIMEDIA)+".jpg";
          const imageUrl = this.ip_address+'/multimedia/'+videoName;
          imageUrls.push(imageUrl);
        }
      }
      //
      const imageUrlAdd = this.ip_address+'/media/rutinas/crear_rutina.jpg';
      imageUrls.push(imageUrlAdd);
      //console.log(imageUrls);

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
      this.obtenerRutinas();
      this.obtenerEjercicios();
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
                this.obtenerEjercicios();
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

    go_page(name: string){
      //this.router.navigate(['/'+name], { state: { previousPage: 'crear-ejercicio' } });
      this.navController.navigateForward('/'+name);
    }
    go_page_create(name: string, data: any) {
      this.navController.navigateForward('/' + name, {
        queryParams: {
          variableRutinas: data
        }
      });
    }

    async savecopy(data:any){
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
              data.ID_EJERCICIOS_RUTINA=data.IDEJERCICIOS.map((elemento:any) => elemento.toString()).join(',');
              data.USUARIOCREACIONRUTINA=this.userSesionPerfil[0].IDPERSONA;
              this.CreateData(data);
              this.enfocarenRutinasporSesion();
            }
          }
        ]
      });
      await alert.present();
    }
    enfocarenRutinasporSesion(){
      const index=this.dataRtuinas.length as number;
      setTimeout(() => {
        const elementoDestino = document.getElementById('elemento-rutinas' + (index ));
        if (elementoDestino) {
          elementoDestino.scrollIntoView({ behavior: 'smooth' });
        }
      }, 50);
    }
    async CreateData(data:any) {
      try {
        this.loading=true;
        const response = await this.apiService.CreteDataRutinas(data).toPromise();
        this.loading=false;
        this.ngOnInit();
        this.presentCustomToast(response.message, "success");
      } catch (error:any) {
        this.presentCustomToast(error.error.errror, "danger");
      }
    }

    public onInputChange(event: any) {
      const currentSearchTerm = event.target.value;
      if (currentSearchTerm.length < this.previousSearchTerm.length) {
        this.dataRtuinas=this.origindata;
        //this.selectedItem = -1;
      }
      this.previousSearchTerm = currentSearchTerm;
      this.filterItems();
    }

    private filterItems() {
      if (!this.origindata) {
        const rawData = this.dataRtuinas;
        this.origindata = rawData.map(item => ({ ...item }));
      }

      const searchTerms = this.searchTerm.toLowerCase().trim().split(' ');
      if (searchTerms.length >= 1) {
        let filteredArray: any[] = [];

        for (const term of searchTerms) {
          const filteredItems = this.dataRtuinas.filter(item =>
            item.NOMBRETIPOEJERCICIO.toLowerCase().includes(term) ||
            item.DESCRIPCIONOBJETIVOSPERSONALES.toLowerCase().includes(term) ||
            item.NOMBRERUTINA.toLowerCase().includes(term) ||
            item.DESCRIPCIONRUTINA.toLowerCase().includes(term) ||
            item.DURACIONRUTINA.toLowerCase().includes(term) ||
            item.IMAGENRUTINA.toLowerCase().includes(term) ||
            item.OBSERVACIONRUTINA.toLowerCase().includes(term)
          );

          filteredArray = filteredArray.concat(filteredItems);
        }

        // Eliminar duplicados del array filtrado
        this.dataRtuinas = Array.from(new Set(filteredArray));
      }
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
              if (data.STATUSRUTINA===0){
                data.STATUSRUTINA=1;
              }else{
                data.STATUSRUTINA=0;
              }
              this.actualizarEjercicioActivacion(data);
            }
          }
        ]
      });

      await alert.present();
    }

    actualizarEjercicioActivacion(data:any){
      this.apiService.UpdataStatus(data,"rutina").subscribe(
        (response) => {
          this.presentCustomToast(response.message,"success");
        },
        (error) => {
          this.presentCustomToast(error.error.error,"danger");
        }
      );
    }

    showSelect(item:any, nombre:string)
    {
    }
    showSelectEdit(item:any, nombre:string)
    {
    }
    showEjerciciosxItem(data: any, index: number) {
      this.mostrarEjerciciosSelect[index] = !this.mostrarEjerciciosSelect[index];
      if (this.mostrarEjerciciosSelect[index] ===true){
        setTimeout(() => {
          const elementoDestino = document.getElementById('elemento-destino-' + index);
          if (elementoDestino) {
            elementoDestino.scrollIntoView({ behavior: 'smooth' });
          }
        }, 50);
      }
    }
    findEjercicioRutina(IDEJERCICIORUTINA: number): any {
      const elemento = this.dataEjercicio.find(objeto => objeto.IDEJERCICIO === IDEJERCICIORUTINA);
      return elemento;
    }
    getVideoName(url: string): string {
      return url.split('.')[0];
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

    obtenerRutinas(){
      this.apiService.getRutinas().subscribe(
        (response) => {
          this.dataRtuinas=response;
          this.dataRtuinas = this.dataRtuinas.map(objeto => ({
            ...objeto,
            IDEJERCICIOS: objeto.IDEJERCICIOS.split(",").map(Number)
          }));
          setTimeout(() => {
            this.cargarImagenesBefore();
          }, 1000);
        },
        (error) => {
          this.presentCustomToast(error.error.error,"danger");
        }
      );
    }
    obtenerEjercicios(){
      this.apiService.getEjercicio().subscribe(
        (response) => {
          this.dataEjercicio=response;
        },
        (error) => {
          this.presentCustomToast(error.error.error,"danger");
        }
      );
    }

}
