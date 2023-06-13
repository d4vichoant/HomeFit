import { Component, OnInit, ViewChild,ElementRef} from '@angular/core';
import { IP_ADDRESS } from '../../../constantes';
import { ApiServiceService } from '../../../api-service.service';
import { Storage } from '@ionic/storage-angular';
import { NavController, ToastController,ItemReorderEventDetail, AlertController  } from '@ionic/angular';
import { StatusBar } from '@capacitor/status-bar';
import { ActivatedRoute,Router } from '@angular/router';

@Component({
  selector: 'app-crear-rutinas',
  templateUrl: './crear-rutinas.page.html',
  styleUrls: ['./crear-rutinas.page.scss'],
})
export class CrearRutinasPage implements OnInit {
  @ViewChild('fileInputRef') fileInputRef!: ElementRef;

  public ip_address = IP_ADDRESS;
  public loading = true;
  public userSesion!:string;
  public userSesionPerfil!:any;
  selectedItem: number = -1;

  public dataRutinas!:any;
  public origindata!:any[];

  variable: any;

  selectedFile: File | null = null;
  nameFile:string='';
  selectedImageUrl!:string;

  public selectImage!:string;
  public imagePortada!:string;

  public tituloRutina! :string;
  public descripcionRutina!:string;
  public visibilidaRutina: string = "";
  public observacionRutina!:string
  public duracionRutina!:string;
  public duracionRutinaOrig!:string;

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


  public mostrarSelecOPersonal:boolean=false;
  selectedOPersonal:any;
  searchOPersonal?: string;
  public dataOPersonal!: any[];

  public selectData!: any[];
  public searchTerm:string="";
  private previousSearchTerm: string = '';
  public mostrarSelect:boolean=false;


  constructor(private storage: Storage,
    private route: ActivatedRoute,
    private apiService: ApiServiceService,
    public toastController: ToastController,
    private navController: NavController,
    public alertController: AlertController) { }

    ngOnInit() {
      this.chanceColorFooter();
      this.validateSesion();
      this.route.queryParams.subscribe(params => {
        this.variable = params['variableRutinas'];
      });
      //this.test();
      if(this.variable){
        this.completarDatos();
      }

      //this.cargarImagenesBefore();
    }
    ionViewDidEnter() {
      this.chanceColorFooter();
      this.route.queryParams.subscribe(params => {
        this.variable = params['variableRutinas'];
      });
      this.validateSesion();
      //this.test();
      if(this.variable){
        this.completarDatos();
      }
      //this.cargarImagenesBefore();
    }

  completarDatos(){
    //console.log(this.variable);
    this.tituloRutina = this.variable.NOMBRERUTINA;
    this.descripcionRutina=this.variable.DESCRIPCIONRUTINA;
    this.visibilidaRutina = this.variable.STATUSRUTINA+"";
    this.duracionRutina =this.variable.DURACIONRUTINA;
    this.imagePortada=this.variable.IMAGENRUTINA;
    this.observacionRutina=this.variable.OBSERVACIONRUTINA;
    //console.log(this.equiporequeridoporEjercicio)
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
      const ejercicios = this.dataEjercicio; // Obtén el array de ejercicios
      const imageUrls = []; // Array para almacenar las URL de las imágenes
      if (Array.isArray(ejercicios)) {
        for (let i = 0; i < ejercicios.length; i++) {
          const videoName = this.getVideoName(ejercicios[i].ALMACENAMIENTOMULTIMEDIA);
          const imageUrl = this.ip_address+'/multimedia/'+videoName+'.jpg';
          imageUrls.push(imageUrl);
        }
      }
      //console.log(ejercicios);

      const imageUrlAdd = this.ip_address+'/media/rutinas/crear_ejerciciorutina.jpg';
      imageUrls.push(imageUrlAdd);
      const imageUrlAdd1 = this.ip_address+'/media/rutinas/background.png';
      imageUrls.push(imageUrlAdd1);
      if (this.imagePortada){
        const imageUrlAdd2 = this.ip_address+'/media/rutinas/portadasrutinas/'+this.imagePortada;
        imageUrls.push(imageUrlAdd2);
      }
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
      this.obtenerTEjercicio();
      this.obtenerEjercicios();
      this.obtenerOPersonales();
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
                this.obtenerOPersonales();
                this.obtenerEntrenadoresBasic();
                this.obtenerEjercicios();
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

    getColorByValue(value: any): string {
      if (value){
        if (value.IDGENERO=== 0) {
          return '#f3aed5'; // Color de fondo para valor1
        } else if (value.IDGENERO === 1) {
          return '#c2e0ff'; // Color de fondo para valor2
        } else if (value.IDGENERO === 2) {
          return '#d1bf00'; // Color de fondo para valor3
        }
      }

      return '#ffffffbb'; // Color de fondo predeterminado
    }

    go_page(name: string){
      //this.router.navigate(['/'+name], { state: { previousPage: 'crear-ejercicio' } });
      this.navController.navigateForward('/'+name);
      this.variable=null|| {};
      this.dataRutinas=null|| {};
    }

    public onInputChange(event: any,nameData:string) {
      const currentSearchTerm = event.target.value;
      if (this.previousSearchTerm && currentSearchTerm.length < this.previousSearchTerm.length) {
        this.cargarDatos(nameData);
      }
      this.previousSearchTerm = currentSearchTerm;
      this.filterItems(nameData);
    }
    handleFileInput(event: any) {
      const file = event.target.files[0];

      // Validar el tipo de archivo
      if (!file.type.includes('image/jpeg')) {
        // El archivo seleccionado no es un archivo JPG
        // Realiza alguna acción o muestra un mensaje de error
        return;
      }

      // Validar el tamaño del archivo
      if (file.size > 1024 * 1024) {
        // El archivo seleccionado supera el tamaño máximo de 1MB
        // Realiza alguna acción o muestra un mensaje de error
        this.presentCustomToast("Imagen no puede ser mayor de 1MB", "danger");
        return;
      }

      this.selectedFile = file;
      this.nameFile = file.name;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.selectedImageUrl = e.target.result;
        this.presentCustomToast("Imagen seleccionada correctamente", "success");
      };
      reader.readAsDataURL(file);
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
        }else  if(nameData==="dataTrainerBasic"){
          for (const term of searchTerms) {
            const filteredItems = this.selectData.filter(item =>
              item.NOMBREPERSONA.toLowerCase().includes(term) ||
              item.APELLDOPERSONA.toLowerCase().includes(term)
            );
            filteredArray = filteredArray.concat(filteredItems);
          }
        }
        else if(nameData==="dataOPersonal"){
          for (const term of searchTerms) {
            const filteredItems = this.selectData.filter(item =>
              item.DESCRIPCIONOBJETIVOSPERSONALES.toLowerCase().includes(term)
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
      }else if(nameData==="dataOPersonal"){
        const rawData = this.dataOPersonal;
        this.selectData = rawData.map(item => ({ ...item }));
      }else if(nameData==="dataEjercicio"){
        const rawData = this.dataEjercicio;
        this.selectData = rawData.map(item => ({ ...item }));
      }else  if(nameData==="dataTrainerBasic"){
        const rawData = this.dataTrainerBasic;
        this.selectData = rawData.map(item => ({ ...item }));
      }
    }
    showSelected(nameData:string){
      this.searchTerm="";
      if(nameData==="dataTEjercicio"){
        this.mostrarSelecTEjercicio=!this.mostrarSelecTEjercicio;
        const rawData = this.dataTEjercicio;
        this.selectData = rawData.map(item => ({ ...item }));
      }else if(nameData==="dataOPersonal"){
        this.mostrarSelecOPersonal=!this.mostrarSelecOPersonal;
        const rawData = this.dataOPersonal;
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
      }else if(nameData==="dataOPersonal"){
        this.selectedOPersonal = title;
        this.mostrarSelecOPersonal = false;
      }else if(nameData==="dataTrainerBasic"){
        this.selectedTrainerBasic = title;
        this.mostrarTrainerBasic = false;
      }else if(nameData==="dataEjercicio"){
        if(this.EjercicioporRutinaUniq === null || this.EjercicioporRutinaUniq === undefined){
          this.EjercicioporRutinaUniq=null;
          this.index=-1;
          this.duracionRutina=this.sumarTiempos(this.duracionRutina,title.TIEMPOREALIZACIONEJERCICIO);
          this.dataEjercicioporRutina.push(title);
          this.mostrarSelecEjercicio = false;
        }else{
          this.replaceLastWithIndex(title,this.index);
          this.duracionRutina=this.sumarTiempos(this.duracionRutina,title.TIEMPOREALIZACIONEJERCICIO);
          this.duracionRutinaOrig="";
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
    async confirmchangeCreateData() {
      if(!this.descripcionRutina || !this.selectedTEjercicio
      || !this.tituloRutina || !this.selectedOPersonal || !this.selectedTrainerBasic
      || !this.visibilidaRutina || !this.duracionRutina  || !this.dataEjercicioporRutina ){
        this.presentCustomToast('Debe llenar todos los campos',"danger");
      }else{
        if(this.selectedFile || this.imagePortada){
          const alert = await this.alertController.create({
            header: 'Confirmar Creación/Actualizacion de Datos',
            message: '¿Estás seguro que desea realizar creación/actualización este ejercicio ?',
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

                  if(this.visibilidaRutina === "1" ){
                    this.observacionRutina="N/A";
                  }
                  // if(this.selectedTrainerBasic.IDROLUSUARIO===99){
                  //   this.selectedTrainerBasic.IDENTRENADOR=null;
                  // }
                  this.dataRutinas={
                    IDENTRENADOR:this.selectedTrainerBasic.IDPERSONA,
                    IDTIPOEJERCICIORUTINA:this.selectedTEjercicio.IDTIPOEJERCICIO,
                    IDOBJETIVOSPERSONALESRUTINA:this.selectedOPersonal.IDOBJETIVOSPERSONALES,
                    NOMBRERUTINA:this.tituloRutina,
                    DESCRIPCIONRUTINA:this.descripcionRutina,
                    DURACIONRUTINA:this.duracionRutina,
                    IMAGENRUTINA:this.sanitizeFileName(this.tituloRutina+".jpg"),
                    OBSERVACIONRUTINA:this.observacionRutina,
                    USUARIOCREACIONRUTINA: this.userSesionPerfil[0].IDPERSONA,
                    STATUSRUTINA:Number(this.visibilidaRutina),
                    ID_EJERCICIOS_RUTINA:this.obtenerIDEjercicios(this.dataEjercicioporRutina)
                  }
                  if(this.selectedFile){
                    this.updateFileImage(this.dataRutinas.IMAGENRUTINA);
                  }else{
                    this.dataRutinas.IMAGENRUTINA=this.imagePortada;
                  }
                  if(this.variable){
                    this.dataRutinas. USUARIOMODIFICAIONRUTINA =this.userSesionPerfil[0].IDPERSONA,
                    this.dataRutinas.IDRUTINA=this.variable.IDRUTINA;
                    this.UpdateData();
                  }else{
                    this.CreateData();
                  }

                }
              }
            ]
          });
          await alert.present();
        }else{
          this.presentCustomToast("Debe seleccionar Portada de Rutina","danger");
        }
      }
    }
    async UpdateData() {
      try {
        this.loading=true;
        const response = await this.apiService.UpdateDataRutinas(this.dataRutinas).toPromise();
        this.loading=false;
        this.presentCustomToast(response.message, "success");
        this.go_page('rutinas');
        this.inicio();
        this.ngOnInit();
        this.ionViewDidEnter();
      } catch (error:any) {
        this.presentCustomToast(error.error.error, "danger");
      }
    }

    async CreateData() {
      try {
        this.loading=true;
        const response = await this.apiService.CreteDataRutinas(this.dataRutinas).toPromise();
        this.loading=false;
        this.presentCustomToast(response.message, "success");
        this.go_page('rutinas');
        this.inicio();
        this.ngOnInit();
        this.ionViewDidEnter();
      } catch (error:any) {
        this.presentCustomToast(error.error.errror, "danger");
      }
    }
    obtenerIDEjercicios(arr: any[]): string {
      return arr.map(objeto => objeto.IDEJERCICIO).join(",");
    }
    updateFileImage(filename :string){
      if(this.selectedFile){
        this.apiService.uploadcaptureImagenRutinas(this.selectedFile,filename).subscribe(
          (response) => {
            this.selectedFile=null;
            //this.presentCustomToast(response.message,"success");
          },
          (error) => {
            this.presentCustomToast(error.error.error,"danger");
          }
        );
      }else{
        this.presentCustomToast("Portada de Rutina No seleccionada","danger");
      }

    }
    sanitizeFileName(fileName:string) {
      const sanitizedText = fileName
        .toLowerCase()
        .replace(/\s+/g, "_")
        .replace(/[^a-z0-9_.-]/g, "");

      return sanitizedText ;
    }
    sumarTiempos(tiempo1:string, tiempo2:string) {
      if (!tiempo1){
        tiempo1="00:00:00";
      }
      const msTiempo1 = this.tiempoToMilliseconds(tiempo1);
      const msTiempo2 = this.tiempoToMilliseconds(tiempo2);
      const suma = msTiempo1 + msTiempo2;
      const tiempoSuma = this.millisecondsToTiempo(suma);
      return tiempoSuma;
    }
    restarTiempos(tiempo1:string, tiempo2:string) {
      if (!tiempo1){
        tiempo1="00:00:00";
      }
      const timeOrig = tiempo1;
      this.duracionRutinaOrig =timeOrig;
      const msTiempo1 = this.tiempoToMilliseconds(tiempo1);
      const msTiempo2 = this.tiempoToMilliseconds(tiempo2);
      const resta  = msTiempo1 - msTiempo2;
      const tiempoResta  = this.millisecondsToTiempo(resta);
      return tiempoResta;
    }
    tiempoToMilliseconds(tiempo:string) {
      const partes = tiempo.split(':');
      const horas = parseInt(partes[0], 10);
      const minutos = parseInt(partes[1], 10);
      const segundos = parseInt(partes[2], 10);

      return horas * 3600000 + minutos * 60000 + segundos * 1000;
    }

    millisecondsToTiempo(ms:number) {
      const horas = Math.floor(ms / 3600000);
      const minutos = Math.floor((ms % 3600000) / 60000);
      const segundos = Math.floor((ms % 60000) / 1000);

      return this.pad(horas) + ':' + this.pad(minutos) + ':' + this.pad(segundos);
    }
    pad(valor: number | string): string {
      return valor.toString().padStart(2, '0'); // Agrega ceros a la izquierda si el valor es menor que 10
    }
    cancelarmostrarSelecEjercicio(){
      this.mostrarSelecEjercicio=!this.mostrarSelecEjercicio;
      this.duracionRutina=this.duracionRutinaOrig;
      this.duracionRutinaOrig="";
    }

    uploadImage() {
      this.fileInputRef.nativeElement.click();
    }
    replaceLastWithIndex(newData: any, replacementIndex: number) {
      this.dataEjercicioporRutina[replacementIndex]=newData;
    }

    RemoveItemERequerido(index:number){
      this.duracionRutina=this.restarTiempos(this.duracionRutina,this.dataEjercicioporRutina[index].TIEMPOREALIZACIONEJERCICIO);
      this.dataEjercicioporRutina.splice(index, 1);
    }

    EditItemERequerido(data:any,index:number){
      this.duracionRutina = this.restarTiempos(this.duracionRutina,data.TIEMPOREALIZACIONEJERCICIO);
      this.index=index;
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
    obtenerOPersonales(){
      this.apiService.allObjetivosPersonales().subscribe(
        (response) => {
          this.dataOPersonal=response;
          if(this.variable)
          this.selectedOPersonal = this.dataOPersonal.find(item => item.IDOBJETIVOSPERSONALES === this.variable.IDOBJETIVOSPERSONALESRUTINA);
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
          if(this.variable)
          this.selectedTEjercicio = this.dataTEjercicio.find(item => item.IDTIPOEJERCICIO === this.variable.IDTIPOEJERCICIORUTINA);
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
          if(this.variable)
          this.selectedTrainerBasic=this.dataTrainerBasic.find(item => item.IDPERSONA === this.variable.IDENTRENADOR);
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
          if(this.variable){
            this.dataEjercicioporRutina = this.variable.IDEJERCICIOS.map((IDEJERCICIOS: number) => this.dataEjercicio.find(ejercicio => ejercicio.IDEJERCICIO === IDEJERCICIOS));
          }
          setTimeout(() => {
            this.cargarImagenesBefore();
          }, 1000);
        },
        (error) => {
          this.presentCustomToast(error.error.error,"danger");
        }
      );
    }
    inicio(){
      this.dataRutinas=[];
      this.selectedImageUrl="";
      this.mostrarSelecEjercicio=false;
      this.mostrarSelecEjercicio=false;
      this.mostrarSelecTEjercicio=false;
      this.selectedTrainerBasic=null,
      this.selectedTEjercicio=null,
      this.selectedOPersonal=null,
      this.tituloRutina="",
      this.descripcionRutina="",
      this.duracionRutina="",
      this.nameFile="";
      this.observacionRutina="";
      this.userSesionPerfil=[],
      this.visibilidaRutina="",
      this.dataEjercicioporRutina=[];
    }
}

