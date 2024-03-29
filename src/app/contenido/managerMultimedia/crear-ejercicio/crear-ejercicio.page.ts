import { Component, OnInit,ViewChild  } from '@angular/core';
import { ActivatedRoute,Router } from '@angular/router';
import { IP_ADDRESS } from '../../../constantes';
import { NavController, ToastController, IonRouterOutlet, AlertController} from '@ionic/angular';
import { StatusBar } from '@capacitor/status-bar';
import { Storage } from '@ionic/storage-angular';
import { ApiServiceService } from '../../../api-service.service';
import { IonCard } from '@ionic/angular';

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

  @ViewChild(IonCard) card!: IonCard;
  touchTimeout: any;
  dataComentarioporEjercicio!: any[];
  currentTab = 1;
  mostarDialogComment:boolean=false;
  dataComentarioporEjercicioUniq:any;

  NumberStar :number=4;

  public userSesion!:string;
  public userSesionPerfil!:any;
  public dataEjercicio!:any;

  public mostrarSelectMultimedia:boolean=false;
  selectedMultimedia?:any;
  searchTermMultimedia?: string;
  public dataMultimedia!: any[];

  public mostrarSelecERequerido:boolean=false;
  selectERequerido:any;
  searchERequerido?: string;
  public dataERequerido!: any[];

  public mostrarSelecMET:boolean=false;
  selectedMET:any;
  searchMET?: string;
  public dataMET!: any[];

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
  //public tiempoRealizar!:string;
  //public metEjercicio!:string;
  public variacionEjercicio!:string;
  public adicionalInformacion!:string;
  public equiporequeridoporEjercicio!:any[];
  public OriginequiporequeridoporEjercicio!:any[];

  public readonlyvalue :boolean =false;

  constructor(private route: ActivatedRoute,
    private navController: NavController,
    public toastController: ToastController,
    private storage: Storage,
    private apiService: ApiServiceService,
    private router: Router,
    public alertController: AlertController) { }

  ngOnInit() {
    this.inicio();
    this.chanceColorFooter();
    this.route.queryParams.subscribe(params => {
      this.variable = params['variable'];
    });
    //this.test();
    this.validateSesion();
    if(this.variable){
      this.completarDatos();
    }
    if(!this.equiporequeridoporEjercicio){
      this.equiporequeridoporEjercicio=[];
    }
    this.loading = true;
  }

  ionViewDidEnter() {
    this.inicio();
    this.chanceColorFooter();
    this.route.queryParams.subscribe(params => {
      this.variable = params['variable'];
    });

    this.validateSesion();
    //this.test();
    if(this.variable){
      this.completarDatos();
    }
    if(!this.equiporequeridoporEjercicio){
      this.equiporequeridoporEjercicio=[];
    }
    this.loading = false;

  }

  completarDatos(){
    this.readonlyvalue=true;
    //console.log(this.variable);
    this.currentTab=1;
    this.nombreEjercicio = this.variable.NOMBREEJERCICIO;
    this.nombreDescripcion = this.variable.DESCRIPCIONEJERCICIO;
    this.instruccion = this.variable.INTRUCCIONESEJERCICIO;
    this.pesoRecomendado=this.variable.PESOLEVANTADOEJERCICIO;
    this.repeticiones = this.variable.REPETICIONESEJERCICIO;
    //this.metEjercicio = this.variable.METEJERCICIO;
    this.variacionEjercicio = this.variable.VARIACIONESMODIFICACIONEJERCICIOPROGRESO;
    this.adicionalInformacion = this.variable.OBSERVACIONESEJERCICIO;
    this.obtenerComentarioporEjercicio(this.variable.IDEJERCICIO);
    if(this.variable.TITULOS_EQUIPOS_REQUERIDOS && this.variable.ID_EQUIPOS_REQUERIDOS){
      this.textConvertir(this.variable.TITULOS_EQUIPOS_REQUERIDOS,this.variable.ID_EQUIPOS_REQUERIDOS);
    }else{
      this.equiporequeridoporEjercicio=[];
    }
    //console.log(this.equiporequeridoporEjercicio)
  }

  textConvertir(TITULOS_EQUIPOS_REQUERIDOS:string,EQUIPOS_REQUERIDOS:string){
    const titulosArray = TITULOS_EQUIPOS_REQUERIDOS.split(',');
    const equiposArray = EQUIPOS_REQUERIDOS.split(',');
    const resultado = [];
    for (let i = 0; i < titulosArray.length; i++) {
      resultado.push({ NOMBREEQUIPOREQUERIDO: titulosArray[i], IDEQUIPOREQUERIDO: Number(equiposArray[i]) });
    }
    this.equiporequeridoporEjercicio=resultado;
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
  go_page(name: string){
    this.dataEjercicio=[];
    this.inicio();
    this.navController.navigateForward('/' + name, {
      queryParams: {
        variable: ""
      }
    });
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
    this.obtenerEquipoRequerido();
  }
  validateSesion(){
    try{
      this.storage.get('sesion').then((sesion) => {
        if (sesion && JSON.parse(sesion).rolUsuario == 99 || JSON.parse(sesion).rolUsuario == 2) {
          this.userSesion = JSON.parse(sesion).nickname;
          this.obtenerGetPerfilCompleto(this.userSesion);
          this.apiService.protectedRequestWithToken(JSON.parse(sesion).token).subscribe(
            (response) => {
              this.StatusBar();
              this.obtenerMultimedia();
              this.obtenerTEjercicio();
              this.obtenerNDificultad();
              this.obtenerMET();
              this.obtenerOMuscular();
              this.obtenerEquipoRequerido();
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
      }else if (nameData==="dataERequerido"){
        for (const term of searchTerms) {
          const filteredItems = this.selectData.filter(item =>
            item.NOMBREEQUIPOREQUERIDO.toLowerCase().includes(term)
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
      }else if(nameData =="dataERequerido"){
        this.mostrarSelecERequerido=!this.mostrarSelecERequerido;
        const rawData = this.dataERequerido;
        this.selectData = rawData.map(item => ({ ...item }));
        this.selectERequerido={};
      }else if(nameData==="dataMET"){
        this.mostrarSelecMET=!this.mostrarSelecMET;
        const rawData = this.dataMET;
        this.selectData = rawData.map(item => ({ ...item }));
      }
    }
    showSelectedERequerido(nameData:string,data:any){
      if (nameData =="dataERequerido"){
        this.mostrarSelecERequerido=!this.mostrarSelecERequerido;
        const rawData = this.dataERequerido;
        this.selectData = rawData.map(item => ({ ...item }));
        this.selectERequerido=data;
        const rawData2 = this.equiporequeridoporEjercicio;
        this.OriginequiporequeridoporEjercicio = rawData2.map(item => ({ ...item }));
        this.RemoveItemERequerido(data);
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
      }else if(nameData==="dataERequerido"){
        const rawData = this.dataERequerido;
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
      }else if(nameData==="dataMET"){
        this.selectedMET = title;
        this.mostrarSelecMET = false;
      }
    }
    selectItemERequerido(data: any) {
      const existingObject = this.equiporequeridoporEjercicio.find(item => item.IDEQUIPOREQUERIDO === data.IDEQUIPOREQUERIDO);
      if (!existingObject) {
        this.equiporequeridoporEjercicio.push(data);
        this.mostrarSelecERequerido = false;
        if(this.OriginequiporequeridoporEjercicio && this.OriginequiporequeridoporEjercicio.length>0){
          this.OriginequiporequeridoporEjercicio=[];
        }
      }else{
        this.presentCustomToast('Ese equipo Requerido ya esta Seleccionado',"danger");
      }
    }
    cancelarItemRequerido(){
      if(this.OriginequiporequeridoporEjercicio && this.OriginequiporequeridoporEjercicio.length>0 ){
        this.equiporequeridoporEjercicio=this.OriginequiporequeridoporEjercicio;
      }
      this.mostrarSelecERequerido = !this.mostrarSelecERequerido
    }
    RemoveItemERequerido(data:any){
      //console.log(data);
      const newArray = this.equiporequeridoporEjercicio.filter(item => item.IDEQUIPOREQUERIDO !== data.IDEQUIPOREQUERIDO);
      this.equiporequeridoporEjercicio=newArray;
    }
    async confirmRemoveItemERequerido(data:any) {
        const alert = await this.alertController.create({
          header: 'Confirmar Estado',
          message: '¿Estás seguro que desea eliminar este Eq. Requerido ?',
          buttons: [
            {
              text: 'Cancelar',
              role: 'cancel',
              cssClass: 'secondary',
              handler: () => {
                this.presentCustomToast('Proceso cancelada',"danger");
              }
            }, {
              text: 'Eliminar',
              handler: () => {
                this.RemoveItemERequerido(data);
              }
            }
          ]
        });
        await alert.present();
    }

    onCardTouchStartRemoveItemERequerido(event: TouchEvent,data:any) {
      this.touchTimeout = setTimeout(() => {
        this.confirmRemoveItemERequerido(data);
      }, 1000);
    }

    onCardTouchEndRemoveItemERequerido(event: TouchEvent) {
      clearTimeout(this.touchTimeout);
    }
    cleanSelecItem(){
      this.mostrarSelectMultimedia =false;
      this.mostrarSelecTEjercicio=false;
      this.mostrarSelecNDificultad=false;
      this.mostrarSelecOMuscular=false;
    }


    getVideoName(url: string): string {
      return url.split('.')[0];
    }



    async confirmchangeCreateData() {
      if(!this.selectedMultimedia || !this.selectedTEjercicio
      || !this.selectedNDificultad || !this.selectedOMuscular
      || !this.nombreEjercicio || !this.nombreDescripcion  || !this.instruccion
      || !this.pesoRecomendado || !this.repeticiones
      || !this.selectedMET || !this.variacionEjercicio  || !this.adicionalInformacion){
        this.presentCustomToast('Debe llenar todos los campos',"danger");
      }else{
        const alert = await this.alertController.create({
          header: 'Confirmar Creación/Actualizacion de Datos',
          message: '¿Estás seguro que desea realizar craeción/actualización este ejercicio ?',
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
                  IDENTRENADOR:this.userSesionPerfil[0].IDPERSONA,
                  IDOBJETIVOMUSCULAR:this.selectedOMuscular.IDOBJETIVOSMUSCULARES,
                  NOMBREEJERCICIO:this.nombreEjercicio,
                  DESCRIPCIONEJERCICIO:this.nombreDescripcion ,
                  INTRUCCIONESEJERCICIO:this.instruccion  ,
                  PESOLEVANTADOEJERCICIO: this.pesoRecomendado,
                  REPETICIONESEJERCICIO: this.repeticiones,
                  //TIEMPOREALIZACIONEJERCICIO: this.tiempoRealizar,
                  METEJERCICIO: this.selectedMET.idMetabolicEquivalentOfTask ,
                  VARIACIONESMODIFICACIONEJERCICIOPROGRESO: this.variacionEjercicio,
                  OBSERVACIONESEJERCICIO: this.adicionalInformacion,
                  USUARIOCREACIONEJERCICIO: this.userSesionPerfil[0].IDPERSONA,
                  ESTADOEJERCICIO:1
                }
                if(this.variable){
                  this.dataEjercicio.USUARIOMODIFICAICONEJERCICIO=this.userSesionPerfil[0].IDPERSONA;
                  this.dataEjercicio.IDEJERCICIO=this.variable.IDEJERCICIO;
                  this.dataEjercicio.ESTADOEJERCICIO= this.variable.ESTADOEJERCICIO;
                  this.dataEjercicio.IDENTRENADOR=this.variable.IDENTRENADOR;
                  if(this.equiporequeridoporEjercicio.length>0){
                    const idArray = this.equiporequeridoporEjercicio.map(item => item.IDEQUIPOREQUERIDO).join(',');
                    this.dataEjercicio.ID_EQUIPOS_REQUERIDOS= idArray;
                  }
                  this.UpdateData();
                }else{
                  if(this.equiporequeridoporEjercicio.length>0){
                    const idArray = this.equiporequeridoporEjercicio.map(item => item.IDEQUIPOREQUERIDO).join(',');
                    this.dataEjercicio.ID_EQUIPOS_REQUERIDOS= idArray;
                  }
                  this.CreateData();
                }
              }
            }
          ]
        });
        await alert.present();
      }
    }
    OpenDialogNewERequ(){
    }
    async CreateData() {
      try {
        this.loading=true;
        const response = await this.apiService.CreteDatEjercicio(this.dataEjercicio).toPromise();
        this.loading=false;
        this.presentCustomToast(response.message, "success");
        this.go_page('videos');
        this.ngOnInit();
        this.dataEjercicio = [];
        this.inicio();
      } catch (error:any) {
        this.presentCustomToast(error.error.error, "danger");
      }
    }

    async UpdateData() {
      try {
        this.loading=true;
        const response = await this.apiService.UpdateEjercicio(this.dataEjercicio).toPromise();
        this.loading=false;
        this.presentCustomToast(response.message, "success");
        this.go_page('videos');
        this.ngOnInit();
        this.dataEjercicio = [];
        this.inicio();
      } catch (error:any) {
        this.presentCustomToast(error.error.error, "danger");
      }
    }


  obtenerMultimedia(){
    this.apiService.getMultimediaActivate().subscribe(
      (response) => {
        this.dataMultimedia=response;
        if(this.variable)
          this.selectedMultimedia = this.dataMultimedia.find(item => item.IDMULTIMEDIA === this.variable.IDMULTIMEDIA);
        if (this.userSesionPerfil[0].IDROLUSUARIO===2 ){
          this.dataMultimedia = this.dataMultimedia.filter(element => element.IDENTRENADORMULTIMEDIA  === this.userSesionPerfil[0].IDPERSONA || element.IDROLUSUARIO  === 99 );
          this.dataMultimedia.sort((a, b) => {
            if (a.IDENTRENADORMULTIMEDIA === this.userSesionPerfil[0].IDPERSONA && b.IDENTRENADORMULTIMEDIA === this.userSesionPerfil[0].IDPERSONA) {
              return 0; // Mantener el orden relativo entre ellos
            } else if (a.IDENTRENADORMULTIMEDIA ===  this.userSesionPerfil[0].IDPERSONA) {
              return -1; // Colocar a antes de b
            } else if (b.IDENTRENADORMULTIMEDIA ===  this.userSesionPerfil[0].IDPERSONA) {
              return 1; // Colocar b antes de a
            } else {
              return 0; // No cambiar el orden entre a y b
            }
          });
          //console.log(this.dataEjercicio);
        }
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
  obtenerEquipoRequerido(){
    this.apiService.allEquipoRequeridoActivate().subscribe(
      (response) => {
        this.dataERequerido=response;
        //console.log(this.dataERequerido);
      },
      (error) => {
        this.presentCustomToast(error.error.error,"danger");
      }
    );
  }

  obtenerMET(){
    this.apiService.allMet().subscribe(
      (response) => {
        this.dataMET=response;
        if(this.variable)
        this.selectedMET = this.dataMET.find(item => item.idMetabolicEquivalentOfTask  === this.variable.METEJERCICIO);
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
        //console.log(this.userSesionPerfil);
      },
      (error) => {
        this.presentCustomToast(error.error.error,"danger");
      }
    );
  }
  obtenerComentarioporEjercicio(idEjercicio:number){
    this.apiService.ObtenerComentarioPorEjercicio(idEjercicio).subscribe(
      (response) => {
        this.dataComentarioporEjercicio=response as any[];
        //console.log(this.dataComentarioporEjercicio);
      },
      (error) => {
        this.presentCustomToast(error.error.error,"danger");
      }
    );
  }
  inicio(){
    this.readonlyvalue=false;
    this.selectedMultimedia=null;
    this.selectedTEjercicio=null;
    this.selectedNDificultad=null;
    this.selectedOMuscular=null;
    this.selectedMET=null;
    this.nombreEjercicio='';
    this.nombreDescripcion='';
    this.instruccion='';
    this.pesoRecomendado='';
    this.repeticiones='';
    //this.tiempoRealizar='';
    //this.metEjercicio='';
    this.variacionEjercicio='';
    this.adicionalInformacion='';
    this.equiporequeridoporEjercicio=null as any;
  }
  showTab(tabNumber: number) {
    this.presentCustomToast("Recuerde Guardar en cada Pestaña","warning");
    this.currentTab = tabNumber;
    if(tabNumber===2){
      this.obtenerComentarioporEjercicio(this.variable.IDEJERCICIO);
      //console.log(this.dataComentarioporEjercicio);
    }
  }
  isTabSelected(tabNumber: number): boolean {
    return this.currentTab === tabNumber;
  }

  onCardTouchStart(event: TouchEvent,data:any) {
    this.touchTimeout = setTimeout(() => {
      // Lógica para abrir otro card o mostrar un diálogo
      //console.log('El usuario ha mantenido presionado el card durante 2 segundos o más'+data.IDPROGRESO);
      this.mostarDialogComment=!this.mostarDialogComment;
      this.dataComentarioporEjercicioUniq=data;
    }, 1000);
  }

  onCardTouchEnd(event: TouchEvent) {
    clearTimeout(this.touchTimeout);
  }
  changeStatusProgreso(data:any){
    if(data.STATUSPROGRESO===1){
      data.STATUSPROGRESO=0;
    }else{
      data.STATUSPROGRESO=1;
    }
    this.apiService.UpdataStatus(data,"progreso").subscribe(
      (response) => {
        this.presentCustomToast("Comentario ha sido cambio la Visibilidad","success")
        this.mostarDialogComment=!this.mostarDialogComment;
      },
      (error) => {
        this.presentCustomToast(error.error.error,"danger");
      }
    );
  }
}
