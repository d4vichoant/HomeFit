import { Component, OnInit } from '@angular/core';
import { IP_ADDRESS } from '../../../constantes';
import { ApiServiceService } from '../../../api-service.service';
import { Storage } from '@ionic/storage-angular';
import { NavController, ToastController,ItemReorderEventDetail  } from '@ionic/angular';
import { StatusBar } from '@capacitor/status-bar';

@Component({
  selector: 'app-crear-rutinas',
  templateUrl: './crear-rutinas.page.html',
  styleUrls: ['./crear-rutinas.page.scss'],
})
export class CrearRutinasPage implements OnInit {
  public ip_address = IP_ADDRESS;
  public loading = true;
  public userSesion!:string;
  public userSesionPerfil!:any;
  selectedItem: number = -1;

  public dataRutinas!:any[];
  public origindata!:any[];

  public tituloRutina! :string;
  public descripcionRutina!:string;
  public visibilidaRutina: string = "";
  public observacionRutina!:string
  public duracionRutina!:string;

  public mostrarSelecTEjercicio:boolean=false;
  selectedTEjercicio:any;
  searchTEjercicio?: string;
  public dataTEjercicio!: any[];

  public mostrarTrainerBasic:boolean=false;
  selectedTrainerBasic:any;
  searchTrainerBasic?: string;
  public dataTrainerBasic!: any[];

  public mostrarSelecEjercicio:boolean=false;
  selectedEjercicio:any;
  searchEjercicio?: string;
  public dataEjercicio!: any[];

  public dataEjercicioporRutina!: any[];
  public EjercicioporRutinaUniq!: any;
  public index!:number;


  public mostrarSelecOMuscular:boolean=false;
  selectedOMuscular:any;
  searchOMuscular?: string;
  public dataOMuscular!: any[];

  public selectData!: any[];
  public searchTerm:string="";
  private previousSearchTerm: string = '';
  public mostrarSelect:boolean=false;


  constructor(private storage: Storage,
    private apiService: ApiServiceService,
    public toastController: ToastController,
    private navController: NavController) { }

    ngOnInit() {
      this.chanceColorFooter();
      //this.validateSesion();
      this.test();
      this.cargarImagenesBefore();
    }
    ionViewDidEnter() {
      this.test();
      this.chanceColorFooter();
      //this.validateSesion();
      this.cargarImagenesBefore();
      this.inicio();
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
      let imagesLoaded = 0;
      const image1 = new Image();
      const image2 = new Image();
      image1.src = IP_ADDRESS + '/media/images/control-sesiones-1.png';
      image2.src = IP_ADDRESS + '/media/images/control-sesiones-2.png';

      const handleImageLoad = () => {
        imagesLoaded++;
        if (imagesLoaded === 2) {
          this.loading = false;
        }
      };

      image1.onload = handleImageLoad;
      image2.onload = handleImageLoad;
    }
    test(){
      this.StatusBar();
      this.obtenerTEjercicio();
      this.obtenerEjercicios();
      this.obtenerOMuscular();
      this.obtenerEntrenadoresBasic();
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
                this.obtenerTEjercicio();
                this.obtenerEjercicios();
                this.obtenerOMuscular();
                this.obtenerEntrenadoresBasic();
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

    public onInputChange(event: any,nameData:string) {
      const currentSearchTerm = event.target.value;
      if (this.previousSearchTerm && currentSearchTerm.length < this.previousSearchTerm.length) {
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

        if(nameData==="dataTEjercicio"){
          for (const term of searchTerms) {
            const filteredItems = this.selectData.filter(item =>
              item.NOMBRETIPOEJERCICIO.toLowerCase().includes(term)
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
        else if(nameData==="dataEjercicio"){
          for (const term of searchTerms) {
            const filteredItems = this.selectData.filter(item =>
              item.NOMBREEJERCICIO.toLowerCase().includes(term)||
              item.tituloniveldificultadejercicio.toLowerCase().includes(term)||
              item.NOMBRETIPOEJERCICIO.toLowerCase().includes(term)
            );
            filteredArray = filteredArray.concat(filteredItems);
          }
        }
        // Eliminar duplicados del array filtrado
        this.selectData = Array.from(new Set(filteredArray));
      }
    }

    cargarDatos(nameData:string){
      if(nameData==="dataTEjercicio"){
        const rawData = this.dataTEjercicio;
        this.selectData = rawData.map(item => ({ ...item }));
      }else if(nameData==="dataOMuscular"){
        const rawData = this.dataOMuscular;
        this.selectData = rawData.map(item => ({ ...item }));
      }else if(nameData==="dataEjercicio"){
        const rawData = this.dataEjercicio;
        this.selectData = rawData.map(item => ({ ...item }));
      }
    }
    showSelected(nameData:string){
      this.searchTerm="";
      if(nameData==="dataTEjercicio"){
        this.mostrarSelecTEjercicio=!this.mostrarSelecTEjercicio;
        const rawData = this.dataTEjercicio;
        this.selectData = rawData.map(item => ({ ...item }));
      }else if(nameData==="dataOMuscular"){
        this.mostrarSelecOMuscular=!this.mostrarSelecOMuscular;
        const rawData = this.dataOMuscular;
        this.selectData = rawData.map(item => ({ ...item }));
      }else if(nameData==="dataTrainerBasic"){
        this.mostrarTrainerBasic=!this.mostrarTrainerBasic;
        const rawData = this.dataTrainerBasic;
        this.selectData = rawData.map(item => ({ ...item }));
      }else if(nameData==="dataEjercicio"){
        if(!this.dataEjercicioporRutina){
          this.dataEjercicioporRutina=[];
        }
        this.mostrarSelecEjercicio=!this.mostrarSelecEjercicio;
        const rawData = this.dataEjercicio;
        this.selectData = rawData.map(item => ({ ...item }));
      }
    }
    selectItem(title: any,nameData:string) {
      if(this.selectData){
        this.selectData=[]
      }
     if(nameData==="dataTEjercicio"){
        this.selectedTEjercicio = title;
        this.mostrarSelecTEjercicio = false;
      }else if(nameData==="dataOMuscular"){
        this.selectedOMuscular = title;
        this.mostrarSelecOMuscular = false;
      }else if(nameData==="dataTrainerBasic"){
        this.selectedTrainerBasic = title;
        this.mostrarTrainerBasic = false;
      }else if(nameData==="dataEjercicio"){
        if(this.EjercicioporRutinaUniq === null || this.EjercicioporRutinaUniq === undefined){
          this.EjercicioporRutinaUniq=null;
          this.index=-1;
          this.dataEjercicioporRutina.push(title);
          this.mostrarSelecEjercicio = false;
        }else{
          this.replaceLastWithIndex(title,this.index);
          this.mostrarSelecEjercicio = false;
          this.EjercicioporRutinaUniq=null;
          this.index=-1;
        }
      }
    }
    getVideoName(url: string): string {
      return url.split('.')[0];
    }
    getfirstName(url: string): string {
      return url.split(' ')[0];
    }

    replaceLastWithIndex(newData: any, replacementIndex: number) {
      this.dataEjercicioporRutina[replacementIndex]=newData;
    }

    RemoveItemERequerido(index:number){
      this.dataEjercicioporRutina.splice(index, 1);
    }

    EditItemERequerido(data:any,index:number){
      this.index=index;
      console.log(index);
      this.EjercicioporRutinaUniq=data as any;
      this.mostrarSelecEjercicio=!this.mostrarSelecEjercicio;
      const rawData = this.dataEjercicio;
      this.selectData = rawData.map(item => ({ ...item }));
    }
    handleReorder(ev: CustomEvent<ItemReorderEventDetail>) {
      const itemToMove = this.dataEjercicioporRutina[ev.detail.from]; // Guardamos el elemento que queremos mover en una variable temporal
      this.dataEjercicioporRutina.splice(ev.detail.from, 1);
      this.dataEjercicioporRutina.splice(ev.detail.to, 0, itemToMove);
      ev.detail.complete();
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
    obtenerOMuscular(){
      this.apiService.getObjetivosMusculares().subscribe(
        (response) => {
          this.dataOMuscular=response;
        },
        (error) => {
          this.presentCustomToast(error.error.error,"danger");
        }
      );
    }
    obtenerTEjercicio(){
      this.apiService.getTipoEjercicio().subscribe(
        (response) => {
          this.dataTEjercicio=response;
        },
        (error) => {
          this.presentCustomToast(error.error.error,"danger");
        }
      );
    }
    obtenerEntrenadoresBasic(){
      this.apiService.allTrainerBasic().subscribe(
        (response) => {
          this.dataTrainerBasic=response;
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
          this.dataEjercicio = this.dataEjercicio.map(objeto => {
            if (objeto.TITULOS_EQUIPOS_REQUERIDOS) {
              const equiposRequeridos = objeto.TITULOS_EQUIPOS_REQUERIDOS.split(',').map((nombre: string) => ({ nombre }));
              return { ...objeto, TITULOS_EQUIPOS_REQUERIDOS: equiposRequeridos };
            } else {
              return objeto;
            }
          });
        },
        (error) => {
          this.presentCustomToast(error.error.error,"danger");
        }
      );
    }
    inicio(){
      this.mostrarSelecEjercicio=false;
      this.mostrarSelecEjercicio=false;
      this.mostrarSelecTEjercicio=false;
    }
}

