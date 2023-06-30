import { Component, OnInit } from '@angular/core';
import { StatusBar } from '@capacitor/status-bar';
import { Storage } from '@ionic/storage-angular';
import { IP_ADDRESS } from '../../../constantes';
import { ApiServiceService } from '../../../api-service.service';
import { NavController, ToastController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-listar-sesiones',
  templateUrl: './listar-sesiones.page.html',
  styleUrls: ['./listar-sesiones.page.scss'],
})
export class ListarSesionesPage implements OnInit {
  public ip_address = IP_ADDRESS;

  public userSesion!:string;
  public userSesionPerfil!:any;
  public loading = true;

  variable!:any;

  public dataRutinas!: any[];

  public dataSesiones!:any[];

  isFilled = false;
  showImage=false;

  constructor(private navController: NavController,
    private route: ActivatedRoute,
    private apiService: ApiServiceService,
    private storage: Storage,
    public toastController: ToastController) { }


  ngOnInit() {
    this.recuperarDatos();
    this.validateSesion();
   // this.test();

  }
  ionViewDidEnter() {
    this.recuperarDatos();
    this.validateSesion();
    //this.test();
  }
  test(){
    this.chanceColorFooter();
    this.StatusBar();
    this.obtenerRutinas();
    this.obtenerSesiones();
    this.loading=false;
  }
  recuperarDatos(){
    this.route.queryParams.subscribe(params => {
      this.variable = params['variableSesiones'] as any;
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
              this.obtenerRutinas();
              this.obtenerSesiones();
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
    const rutinas = this.dataRutinas;
    const imageUrls = [];
    if (Array.isArray(rutinas)) {
      for (let i = 0; i < rutinas.length; i++) {
        const nameImagen = rutinas[i].IMAGENRUTINA;
        const imageUrl = this.ip_address+'/media/rutinas/portadasrutinas/'+nameImagen;
        imageUrls.push(imageUrl);
      }
    }
    const sesiones = this.dataSesiones;
    if (Array.isArray(sesiones)) {
      for (let i = 0; i < sesiones.length; i++) {
        const nameImagen = sesiones[i].IMAGESESION;
        const imageUrl = this.ip_address+'/media/sesiones/portadassesiones/'+nameImagen;
        imageUrls.push(imageUrl);
      }
    }

    const imageUrl = this.ip_address+'/media/objetivospersonales/'+this.variable.IMAGEOBJETIVOSPERSONALES;
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
        variableSesiones: ""
      }
    });
  }
  go_page_create(name: string, data: any) {
    this.showImage=false;
    this.navController.navigateForward('/' + name, {
      queryParams: {
        variableRutinaDiaria: data,
        variableSesiones:this.variable
      }
    });
  }
  expandBox(event: any,item:any,name:string) {
    const box = event.target;
    if (box.classList.contains('expanded')) {
      box.classList.remove('expanded');
      box.classList.add('collapsed');
      this.showImage=false;
    } else {
      box.classList.remove('collapsed');
      box.classList.add('expanded');
      this.showImage=true;
      this.go_page_create(name,item);
    }
  }
  getBackgroundStyle(imageUrl: string, showImage: boolean) {
    let gradientColor2 = showImage ? '#f1f3f8' : '#0000009f'; // Color del primer punto del gradiente
    let gradientColor1 = showImage ? '#00000009' : '#ffffff21'; // Color del segundo punto del gradiente
    let backgroundImage = `linear-gradient(0deg, ${gradientColor2}, ${gradientColor1}), url('${this.ip_address}/media/rutinas/portadasrutinas/${imageUrl}')`;

    return {
      'background-image': backgroundImage,
      'background-repeat': 'no-repeat',
      'background-size': 'cover'
    };
  }
  getBackgroundStyle2(imageUrl: string, showImage: boolean) {
    let gradientColor2 = showImage ? '#f1f3f8' : '#0000009f'; // Color del primer punto del gradiente
    let gradientColor1 = showImage ? '#00000009' : '#ffffff21'; // Color del segundo punto del gradiente
    let backgroundImage = `linear-gradient(0deg, ${gradientColor2}, ${gradientColor1}), url('${this.ip_address}/media/sesiones/portadassesiones/${imageUrl}')`;

    return {
      'background-image': backgroundImage,
      'background-repeat': 'no-repeat',
      'background-size': 'cover'
    };
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
  obtenerRutinas(){
    this.apiService.getRutinasActivate().subscribe(
      (response) => {
        this.dataRutinas=response;
        this.dataRutinas = this.dataRutinas.filter(element => element.IDOBJETIVOSPERSONALESRUTINA === this.variable.IDOBJETIVOSPERSONALES);
        this.dataRutinas = this.dataRutinas.map(objeto => ({
          ...objeto,
          IDEJERCICIOS: objeto.IDEJERCICIOS.split(",").map(Number)
        }));
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
        this.dataSesiones = this.dataSesiones.filter(element => element.IDOBJETIVOSPERSONALESSESION === this.variable.IDOBJETIVOSPERSONALES);
        this.dataSesiones = this.dataSesiones.map(objeto => ({
          ...objeto,
          IDRUTINAS: objeto.IDRUTINAS.split(",").map(Number)
        }));
        this.cargarImagenesBefores();
      },
      (error) => {
        this.presentCustomToast(error.error.error,"danger");
      }
    );
  }
}
