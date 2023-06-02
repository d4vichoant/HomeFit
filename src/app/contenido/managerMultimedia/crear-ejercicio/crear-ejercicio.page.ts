import { Component, OnInit } from '@angular/core';
import { ActivatedRoute,Router } from '@angular/router';
import { IP_ADDRESS } from '../../../constantes';
import { NavController, ToastController, IonRouterOutlet} from '@ionic/angular';
import { StatusBar } from '@capacitor/status-bar';
import { Storage } from '@ionic/storage-angular';
import { ApiServiceService } from '../../../api-service.service';


@Component({
  selector: 'app-crear-ejercicio',
  templateUrl: './crear-ejercicio.page.html',
  styleUrls: ['./crear-ejercicio.page.scss'],
})
export class CrearEjercicioPage implements OnInit {
  popoverConfig = {
    cssClass: 'custom-popover'
  };
  public loading = true;
  public ip_address = IP_ADDRESS;
  variable: any;

  public mostrarSelectMultimedia:boolean=false;
  selectedMultimedia?:String="Ninguno";
  searchTermMultimedia?: string;
  public dataMultimedia!: any[];

  public mostrarSelecTEjercicio:boolean=false;
  selectedTEjercicio:String="Ninguno";
  searchTEjercicio?: string;
  public dataTEjercicio!: any[];

  public mostrarSelecNDificultad:boolean=false;
  selectedNDificultad:String="Ninguno";
  searchNDificultad?: string;
  public dataNDificultad!: any[];

  public mostrarSelecOMuscular:boolean=false;
  selectedOMuscular:String="Ninguno";
  searchOMuscular?: string;
  public dataOMuscular!: any[];

  public selectData!: any[];
  public searchTerm:string="";
  private previousSearchTerm: string = '';
  public mostrarSelect:boolean=false;

  public nombreEjercicio!:string;
  public nombreDescripcion!:string;
  public instruccion!:string;
  public pesoRecomendado!:string;
  public repeticiones!:string;
  public tiempoRealizar!:string;
  public numeroSeries!:string;
  public variacionEjercicio!:string;
  public adicionalInformacion!:string;

  constructor(private route: ActivatedRoute,
    private navController: NavController,
    public toastController: ToastController,
    private storage: Storage,
    private apiService: ApiServiceService,
    private router: Router) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.variable = params['variable'];
    });
    //this.test();
    this.validateSesion();

  }
  ionViewDidEnter() {
    this.route.queryParams.subscribe(params => {
      this.variable = params['variable'];
    });
    //this.test();
    this.validateSesion();
  }

  go_page(name: string){
    this.cleanSelecItem();
    this.router.navigate(['/'+name], { state: { previousPage: 'crear-ejercicio' } });
    //this.navController.navigateForward('/'+name);
  }
  StatusBar(){
    StatusBar.hide();
    StatusBar.setOverlaysWebView({ overlay: true });
    StatusBar.setBackgroundColor({ color: '#ffffff' });
  }
  test(){
    this.StatusBar();
    this.loading = false;
    this.obtenerMultimedia();
    this.obtenerTEjercicio();
    this.obtenerNDificultad();
    this.obtenerOMuscular();
  }
  validateSesion(){
    try{
      this.storage.get('sesion').then((sesion) => {
        if (sesion && JSON.parse(sesion).rolUsuario == 99) {
          this.apiService.protectedRequestWithToken(JSON.parse(sesion).token).subscribe(
            (response) => {
              this.StatusBar();
              this.obtenerMultimedia();
              this.obtenerTEjercicio();
              this.obtenerNDificultad();
              this.obtenerOMuscular();
              this.loading = false;
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
    this.navController.navigateForward('/errorvideos');
    this.storage.remove('sesion');
  }
  public onInputChange(event: any,nameData:string) {
    const currentSearchTerm = event.target.value;
    if (currentSearchTerm.length < this.previousSearchTerm.length) {
      this.cargarDatos(nameData);
    }
    this.previousSearchTerm = currentSearchTerm;
    this.filterItems(nameData);
  }
  private filterItems(nameData:string) {
    if (!this.selectData) {
      this.cargarDatos(nameData);
    }
    const searchTerms = this.searchTerm.toLowerCase().trim().split(' ');
    if (searchTerms.length >= 1) {
      let filteredArray: any[] = [];

      if (nameData==="dataMultimedia"){
        for (const term of searchTerms) {
          const filteredItems = this.selectData.filter(item =>
            item.TITULOMULTIMEDIA.toLowerCase().includes(term)
          );
          filteredArray = filteredArray.concat(filteredItems);
        }
      }else if(nameData==="dataTEjercicio"){
        for (const term of searchTerms) {
          const filteredItems = this.selectData.filter(item =>
            item.NOMBRETIPOEJERCICIO.toLowerCase().includes(term)
          );
          filteredArray = filteredArray.concat(filteredItems);
        }
      }else if(nameData==="dataNDificultad"){
        for (const term of searchTerms) {
          const filteredItems = this.selectData.filter(item =>
            item.tituloniveldificultadejercicio.toLowerCase().includes(term)
          );
          filteredArray = filteredArray.concat(filteredItems);
        }
      }else if(nameData==="dataOMuscular"){
        for (const term of searchTerms) {
          const filteredItems = this.selectData.filter(item =>
            item.NOMBREOBJETIVOSMUSCULARES.toLowerCase().includes(term)
          );
          filteredArray = filteredArray.concat(filteredItems);
        }
      }


      // Eliminar duplicados del array filtrado
      this.selectData = Array.from(new Set(filteredArray));
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
    showSelected(nameData:string){
      this.searchTerm="";
      if (nameData==="dataMultimedia"){
        this.mostrarSelectMultimedia=!this.mostrarSelectMultimedia;
        const rawData = this.dataMultimedia;
        this.selectData = rawData.map(item => ({ ...item }));
      }else if(nameData==="dataTEjercicio"){
        this.mostrarSelecTEjercicio=!this.mostrarSelecTEjercicio;
        const rawData = this.dataTEjercicio;
        this.selectData = rawData.map(item => ({ ...item }));
      }else if(nameData==="dataNDificultad"){
        this.mostrarSelecNDificultad=!this.mostrarSelecNDificultad;
        const rawData = this.dataNDificultad;
        this.selectData = rawData.map(item => ({ ...item }));
      }else if(nameData==="dataOMuscular"){
        this.mostrarSelecOMuscular=!this.mostrarSelecOMuscular;
        const rawData = this.dataOMuscular;
        this.selectData = rawData.map(item => ({ ...item }));
      }
    }
    cargarDatos(nameData:string){
      if (nameData==="dataMultimedia"){
        const rawData = this.dataMultimedia;
        this.selectData = rawData.map(item => ({ ...item }));
      }else if(nameData==="dataTEjercicio"){
        const rawData = this.dataTEjercicio;
        this.selectData = rawData.map(item => ({ ...item }));
      }else if(nameData==="dataNDificultad"){
        const rawData = this.dataNDificultad;
        this.selectData = rawData.map(item => ({ ...item }));
      }else if(nameData==="dataOMuscular"){
        const rawData = this.dataOMuscular;
        this.selectData = rawData.map(item => ({ ...item }));
      }
    }
    selectItem(title: string,nameData:string) {
      if (nameData==="dataMultimedia"){
        this.selectedMultimedia = title;
        this.mostrarSelectMultimedia = false; //
      }else if(nameData==="dataTEjercicio"){
        this.selectedTEjercicio = title;
        this.mostrarSelecTEjercicio = false;
      }else if(nameData==="dataNDificultad"){
        this.selectedNDificultad = title;
        this.mostrarSelecNDificultad = false;
      }else if(nameData==="dataOMuscular"){
        this.selectedOMuscular = title;
        this.mostrarSelecOMuscular = false;
      }
    }
    cleanSelecItem(){
      this.mostrarSelectMultimedia =false;
      this.mostrarSelecTEjercicio=false;
      this.mostrarSelecNDificultad=false;
      this.mostrarSelecOMuscular=false;
    }
  obtenerMultimedia(){
    this.apiService.getMultimediaActivate().subscribe(
      (response) => {
        this.dataMultimedia=response;
      },
      (error) => {
        this.presentCustomToast(error.error.error,"danger");
      }
    );
  }
  obtenerTEjercicio(){
    this.apiService.getTipoEjercicioActivate().subscribe(
      (response) => {
        this.dataTEjercicio=response;
      },
      (error) => {
        this.presentCustomToast(error.error.error,"danger");
      }
    );
  }
  obtenerNDificultad(){
    this.apiService.getNivelDificultaDejercicio().subscribe(
      (response) => {
        this.dataNDificultad=response;
      },
      (error) => {
        this.presentCustomToast(error.error.error,"danger");
      }
    );
  }
  obtenerOMuscular(){
    this.apiService.getObjetivosMuscularesActivate().subscribe(
      (response) => {
        this.dataOMuscular=response;
      },
      (error) => {
        this.presentCustomToast(error.error.error,"danger");
      }
    );
  }
}
