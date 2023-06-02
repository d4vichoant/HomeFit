import { Component, OnInit } from '@angular/core';
import { ActivatedRoute,Router } from '@angular/router';
import { IP_ADDRESS } from '../../../constantes';
import { NavController, ToastController, IonRouterOutlet, AlertController} from '@ionic/angular';
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

  public userSesion!:string;
  private userSesionPerfil!:any;
  public dataEjercicio!:any;

  public mostrarSelectMultimedia:boolean=false;
  selectedMultimedia?:any;
  searchTermMultimedia?: string;
  public dataMultimedia!: any[];

  public mostrarSelecTEjercicio:boolean=false;
  selectedTEjercicio:any;
  searchTEjercicio?: string;
  public dataTEjercicio!: any[];

  public mostrarSelecNDificultad:boolean=false;
  selectedNDificultad:any;
  searchNDificultad?: string;
  public dataNDificultad!: any[];

  public mostrarSelecOMuscular:boolean=false;
  selectedOMuscular:any;
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
    private router: Router,
    public alertController: AlertController) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.variable = params['variable'];
    });
    //this.test();
    this.validateSesion();
    if(this.variable){
      this.completarDatos();
    }
  }

  ionViewDidEnter() {
    this.route.queryParams.subscribe(params => {
      this.variable = params['variable'];
      delete params['variable'];
    });

    this.validateSesion();
    //this.test();
    if(this.variable){
      this.completarDatos();
    }

  }

  completarDatos(){
    //console.log(this.variable);
    this.nombreEjercicio = this.variable.NOMBREEJERCICIO;
    this.nombreDescripcion = this.variable.DESCRIPCIONEJERCICIO;
    this.instruccion = this.variable.INTRUCCIONESEJERCICIO;
    this.pesoRecomendado=this.variable.PESOLEVANTADOEJERCICIO;
    this.repeticiones = this.variable.REPETICIONESEJERCICIO;
    this.tiempoRealizar = this.variable.TIEMPOREALIZACIONEJERCICIO;
    this.numeroSeries = this.variable.SERIESEJERCICIO;
    this.variacionEjercicio = this.variable.VARIACIONESMODIFICACIONEJERCICIOPROGRESO;
    this.adicionalInformacion = this.variable.OBSERVACIONESEJERCICIO;
  }

  go_page(name: string){
    this.cleanSelecItem();
    this.router.navigate(['/'+name], { state: { previousPage: 'crear-ejercicio' } });
    this.navController.navigateForward('/'+name);
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
          this.userSesion = JSON.parse(sesion).nickname;
          this.obtenerGetPerfilCompleto(this.userSesion);
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
    selectItem(title: any,nameData:string) {
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
    completarTiempo():void{
       // Si la variable tiene el formato "HH:mm" (ejemplo: "1")
       if (this.tiempoRealizar.length === 1) {
        this.tiempoRealizar = this.tiempoRealizar + "0:00:00";
      }
      // Si la variable tiene el formato "HH:mm" (ejemplo: "12")
      if (this.tiempoRealizar.length === 2) {
        this.tiempoRealizar = this.tiempoRealizar + ":00:00";
      }
      // Si la variable tiene el formato "HH:mm" (ejemplo: "12:")
      if (this.tiempoRealizar.length === 3) {
        this.tiempoRealizar = this.tiempoRealizar + "00:00";
      }
      // Si la variable tiene el formato "HH:mm" (ejemplo: "12:0")
      if (this.tiempoRealizar.length === 4) {
        this.tiempoRealizar = this.tiempoRealizar + "0:00";
      }
      // Si la variable tiene el formato "HH:mm" (ejemplo: "12:00")
      if (this.tiempoRealizar.length === 5) {
      this.tiempoRealizar = this.tiempoRealizar + ":00";
    }
        // Si la variable tiene el formato "HH:mm" (ejemplo: "12:00:")
      if (this.tiempoRealizar.length === 6) {
      this.tiempoRealizar = this.tiempoRealizar + ":00";
      }
       // Si la variable tiene el formato "HH:mm" (ejemplo: "12:00:0")
      if (this.tiempoRealizar.length === 7) {
      this.tiempoRealizar = this.tiempoRealizar + "0";
      }

    }

    formatearTiempo(): void {
      // Eliminar todos los caracteres que no sean números
      const tiempoNumeros = this.tiempoRealizar.replace(/[^0-9]/g, '');

      // Formatear los números ingresados
      let tiempoFormateado = '';
      if (tiempoNumeros.length > 0) {
        tiempoFormateado += tiempoNumeros[0];

        if (tiempoNumeros.length > 1) {
          tiempoFormateado += tiempoNumeros[1] + ':';

          if (tiempoNumeros.length > 2) {
            tiempoFormateado += tiempoNumeros[2];

            if (tiempoNumeros.length > 3) {
              tiempoFormateado += tiempoNumeros[3];

              if (tiempoNumeros.length > 4) {
                tiempoFormateado += ":" +tiempoNumeros[4];
                if (tiempoNumeros.length > 5) {
                  tiempoFormateado += tiempoNumeros[5];
                }
              }
            }
          }
        }
      }

      this.tiempoRealizar = tiempoFormateado;
    }


    async confirmchangeCreateData() {
      if(!this.selectedMultimedia || !this.selectedTEjercicio
      || !this.selectedNDificultad || !this.selectedOMuscular
      || !this.nombreEjercicio || !this.nombreDescripcion  || !this.instruccion
      || !this.pesoRecomendado || !this.repeticiones || !this.tiempoRealizar
      || !this.numeroSeries || !this.variacionEjercicio  || !this.adicionalInformacion){
        this.presentCustomToast('Debe llenar todos los campos',"danger");
      }else{
        const alert = await this.alertController.create({
          header: 'Confirmar Estado',
          message: '¿Estás seguro que desea realizar guardar/actualizar este ejercicio ?',
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
                this.dataEjercicio={
                  IDMULTIMEDIA: this.selectedMultimedia.IDMULTIMEDIA,
                  IDTIPOEJERCICIO:this.selectedTEjercicio.IDTIPOEJERCICIO,
                  IDNIVELDIFICULTADEJERCICIO :this.selectedNDificultad.IDNIVELDIFICULTADEJERCICIO,
                  IDENTRENADOR:this.userSesionPerfil[0].IDROLUSUARIO === 99 ? null : this.userSesionPerfil[0].IDPERSONA,
                  IDOBJETIVOMUSCULAR:this.selectedOMuscular.IDOBJETIVOSMUSCULARES,
                  NOMBREEJERCICIO:this.nombreEjercicio,
                  DESCRIPCIONEJERCICIO:this.nombreDescripcion ,
                  INTRUCCIONESEJERCICIO:this.instruccion  ,
                  PESOLEVANTADOEJERCICIO: this.pesoRecomendado,
                  REPETICIONESEJERCICIO: this.repeticiones,
                  TIEMPOREALIZACIONEJERCICIO: this.tiempoRealizar,
                  SERIESEJERCICIO: this.numeroSeries,
                  VARIACIONESMODIFICACIONEJERCICIOPROGRESO: this.variacionEjercicio,
                  OBSERVACIONESEJERCICIO: this.adicionalInformacion,
                  USUARIOCREACIONEJERCICIO: this.userSesionPerfil[0].IDPERSONA,
                  ESTADOEJERCICIO:1
                }
                if(this.variable){
                  this.dataEjercicio.USUARIOMODIFICAICONEJERCICIO=this.userSesionPerfil[0].IDPERSONA;
                  this.dataEjercicio.IDEJERCICIO=this.variable.IDEJERCICIO;
                  this.dataEjercicio.ESTADOEJERCICIO= this.variable.ESTADOEJERCICIO;
                  this.UpdateData();
                }else{
                  this.CreateData();
                }
                this.go_page('videos');
              }
            }
          ]
        });
        await alert.present();
      }
    }

    CreateData()
    {
      this.apiService.CreteDatEjercicio(this.dataEjercicio).subscribe(
        (response) => {
          this.presentCustomToast(response.message,"success");
          this.ngOnInit();
          this.dataEjercicio={};
          this.inicio();
        },
        (error) => {
          this.presentCustomToast(error.error.error,"danger");
        }
      );
    }
    UpdateData()
    {
      //console.log(this.dataEjercicio);
      this.apiService.UpdateEjercicio(this.dataEjercicio).subscribe(
        (response) => {
          this.presentCustomToast(response.message,"success");
          this.ngOnInit();
          this.dataEjercicio={};
          this.inicio();
        },
        (error) => {
          this.presentCustomToast(error.error.error,"danger");
        }
      );
    }

  obtenerMultimedia(){
    this.apiService.getMultimediaActivate().subscribe(
      (response) => {
        this.dataMultimedia=response;
        if(this.variable)
          this.selectedMultimedia = this.dataMultimedia.find(item => item.IDMULTIMEDIA === this.variable.IDMULTIMEDIA);
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
        if(this.variable)
        this.selectedTEjercicio = this.dataTEjercicio.find(item => item.IDTIPOEJERCICIO === this.variable.IDTIPOEJERCICIO);

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
        if(this.variable)
        this.selectedNDificultad = this.dataNDificultad.find(item => item.IDNIVELDIFICULTADEJERCICIO === this.variable.IDNIVELDIFICULTADEJERCICIO);
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
        if(this.variable)
        this.selectedOMuscular = this.dataOMuscular.find(item => item.IDOBJETIVOSMUSCULARES  === this.variable.IDOBJETIVOMUSCULAR);
      },
      (error) => {
        this.presentCustomToast(error.error.error,"danger");
      }
    );
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
  inicio(){
    this.nombreEjercicio='';
    this.nombreDescripcion='';
    this.instruccion='';
    this.pesoRecomendado='';
    this.repeticiones='';
    this.tiempoRealizar='';
    this.numeroSeries='';
    this.variacionEjercicio='';
    this.adicionalInformacion='';
  }
}
