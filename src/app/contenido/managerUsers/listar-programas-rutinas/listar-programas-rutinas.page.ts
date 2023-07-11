import { Component, OnInit } from '@angular/core';
import { StatusBar } from '@capacitor/status-bar';
import { Storage } from '@ionic/storage-angular';
import { IP_ADDRESS } from '../../../constantes';
import { ApiServiceService } from '../../../api-service.service';
import { NavController, ToastController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-listar-programas-rutinas',
  templateUrl: './listar-programas-rutinas.page.html',
  styleUrls: ['./listar-programas-rutinas.page.scss'],
})
export class ListarProgramasRutinasPage implements OnInit {
  public ip_address = IP_ADDRESS;

  public userSesion!:string;
  public userSesionPerfil!:any;
  public loading = true;

  variable!:any;
  previusPageMain:boolean=false;
  previusPagelistarGuardados:boolean=false;


  public dataSesiones!:any[];
  public dataSesionesOrig!:any[];

  showImage=false;

  LikeOPersonalState: { [key: number]: boolean } = {};
  dataLikeOPersonal!:any[];

  bookmarkSesionesState: { [key: number]: boolean } = {};
  dataBookMarkSesiones!:any[];

  public searchTerm:string="";
  private previousSearchTerm: string = '';

  constructor(
    private navController: NavController,
    private route: ActivatedRoute,
    private apiService: ApiServiceService,
    private storage: Storage,
    public toastController: ToastController) { }

    ngOnInit() {
      this.recuperarDatos();
       this.validateSesion();
     //this.test();

    }
    ionViewDidEnter() {
      this.recuperarDatos();
      this.validateSesion();
      //this.test();
    }
    test(){
      this.chanceColorFooter();
      this.StatusBar();
      this.obtenerbookmarksesiones();
      this.obtenerLikeOPersonal();
      //this.obtenerRutinas();
      //this.obtenerSesiones();
      this.loading=false;
    }
    recuperarDatos(){
      this.route.queryParams.subscribe(params => {
        this.variable = params['variableSesiones'] as any;
        this.previusPageMain = params['previusPageMain'] as boolean|| false;
        this.previusPagelistarGuardados = params['previusPagelistarGuardados'] as boolean|| false;
        this.dataSesiones = params['variablelistarprogramasrutinas'] as any[]|| [];
      });
      const rawData = this.dataSesiones;
      this.dataSesionesOrig = rawData.map(item => ({ ...item }));
      console.log(this.dataSesiones);
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
                this.obtenerLikeOPersonal();
                //this.obtenerRutinas();
                //this.obtenerSesiones();
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
      const imageUrls = [];
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

    public onInputChange(event: any) {
      const currentSearchTerm = event.target.value;
      if (this.previousSearchTerm && currentSearchTerm.length < this.previousSearchTerm.length) {
        this.dataSesiones=this.dataSesionesOrig;
      }
      this.previousSearchTerm = currentSearchTerm;
      this.filterItems();
    }

    private filterItems() {
      this.dataSesiones = this.dataSesionesOrig;

      const searchTerms = this.searchTerm.toLowerCase().trim().split(' ');
      if (searchTerms.length >= 1) {
        let filteredArray: any[] = [];
        for (const term of searchTerms) {
          const filteredItems = this.dataSesiones.filter(item =>
            (item.DESCRIPCIONOBJETIVOSPERSONALES && item.DESCRIPCIONOBJETIVOSPERSONALES.toLowerCase().includes(term)) ||
            (item.NICKNAMEPERSONA && item.NICKNAMEPERSONA.toLowerCase().includes(term)) ||
            (item.NOMBRESESION && item.NOMBRESESION.toLowerCase().includes(term)) ||
            (item.OBJETIVOSESION && item.OBJETIVOSESION.toLowerCase().includes(term)) ||
            (item.OBSERVACIONSESION && item.OBSERVACIONSESION.toLowerCase().includes(term)) ||
            (item.PREMIER && item.PREMIER.toLowerCase().includes(term)) ||
            (item.TituloFrecuenciaEjercicio && item.TituloFrecuenciaEjercicio.toLowerCase().includes(term))
          );
          filteredArray = filteredArray.concat(filteredItems);
        }
        // Eliminar duplicados del array filtrado
        this.dataSesiones = Array.from(new Set(filteredArray));
      }
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
      setTimeout(() => {
        this.loading=false;
      }, 500);
    }
    MessagePremium(){
      this.presentCustomToast('Ejercicio Premium, Suscribase para acceder a ellos','warning');
    }
    go_page(name: string){
      this.navController.navigateForward('/' + name, {
        queryParams: {
          variableSesiones: this.variable,
          previusPageMain : this.previusPageMain,
          previusPagelistarGuardados : this.previusPagelistarGuardados,
        }
      });
    }

    go_page_create(name: string, data: any) {
      this.showImage=false;
      if(name==="rutinas-diarias"){
        this.navController.navigateForward('/' + name, {
          queryParams: {
            variableRutinaDiaria: data,
            variableSesiones:this.variable,
            previusPageMain : this.previusPageMain,
            previusPagelistarGuardados : this.previusPagelistarGuardados,
          }
        });
      }else{
        this.navController.navigateForward('/' + name, {
          queryParams: {
            variableprogramarrutinas: data,
            variableSesiones:this.variable,
            previusPageMain : this.previusPageMain,
            previusPagelistarGuardados : this.previusPagelistarGuardados,
          }
        });
      }
    }
    expandBox(event: any,item:any,name:string) {
      this.go_page_create(name,item);
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
      this.apiService.connsultPerfilUsuarioCompleto(nickname).subscribe(
        (response) => {
          this.userSesionPerfil=response;
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
          if(this.dataSesiones && this.dataSesiones.length>0 ){
            this.cargarImagenesBefores();
          }else{
            this.loading=false;
          }
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
