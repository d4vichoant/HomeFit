import { Component, OnInit,ElementRef, ViewChild} from '@angular/core';
import { IP_ADDRESS } from '../../../constantes';
import { ApiServiceService } from '../../../api-service.service';
import { Storage } from '@ionic/storage-angular';
import { NavController, ItemReorderEventDetail,ToastController, AlertController } from '@ionic/angular';
import { StatusBar } from '@capacitor/status-bar';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-crear-sesiones',
  templateUrl: './crear-sesiones.page.html',
  styleUrls: ['./crear-sesiones.page.scss'],
})
export class CrearSesionesPage implements OnInit {
  @ViewChild('fileInputRef') fileInputRef!: ElementRef;

  public ip_address = IP_ADDRESS;
  public loading = true;
  public userSesion!:string;
  public userSesionPerfil!:any;
  selectedItem: number = -1;

  public dataSesiones!:any;
  public origindata!:any;

  public dataRtuinas!:any[];
  public dataEjercicio!:any[];

  public dataUsersSesiones: any[] = [];
  public dataUsersSesionesOrigin: any[] = [];

  public mostrarRutinasporSesion:boolean=false;
  public dataRutinasporSesion:any[]=[];
  public dataRutinasporSesionUniq!:any;

  public dataObjetivosPersonales!:any[];
  public ObjetivoPersonal:string="";

  public dataFrecuenciaPersonales!:any[];
  public FrecuenciaPersonales:string ="";

  public dataProfesion!:any[];
  public profesion:string="";

  public nombreSesion:string="";
  public objetivoSesion:string="";
  public imagePortada:string="";

  public visibilidaSesion:string ="";
  public observacionSesion:string="";

  selectedFile: File | null = null;
  nameFile:string='';
  selectedImageUrl!:string;

  public duracionSesion!:string;
  public duracionSesionOrig!:string;
  public index!:number;

  variable!:any;

  public selectData!: any[];
  public searchTerm:string="";
  private previousSearchTerm: string = '';
  public mostrarSelect:boolean=false;

  public mostrarTrainerBasic:boolean=false;
  selectedTrainerBasic:any;
  searchTrainerBasic?: string;
  public dataTrainerBasic!: any[];

  public mostrarUsuariosBasic:boolean=false;
  selectedUsuariosBasic:any;
  searchUsuariosBasic?: string;
  public dataUsuariosBasic!: any[];
  mostrarEjerciciosSelect: boolean[] = [];
  mostrarEjerciciosSelectExt: boolean[] = [];

  // public startdate!:string;
  // public enddate! :string ;
  // dateinitialicedStart=false;
  // dateinitialicedEnd=false;
  // public showCalendarStart = false;
  // public showCalendarEnd = false;
  // highlightedDates! :any[];

  //currentTab:number=1;

  constructor(private storage: Storage,
    private apiService: ApiServiceService,
    public toastController: ToastController,
    private navController: NavController,
    public alertController: AlertController,
    private route: ActivatedRoute) {
      // const fechaActual = new Date();
      // const anio = fechaActual.getFullYear();
      // const mes = fechaActual.getMonth() + 1; // Los meses en JavaScript se indexan desde 0, por lo que se suma 1
      // const dia = fechaActual.getDate();
      // const fechaFormateada = `${anio}-${mes.toString().padStart(2, '0')}-${dia.toString().padStart(2, '0')}`;
      // fechaActual.setDate(fechaActual.getDate() );
      // const anio1 = fechaActual.getFullYear();
      // const mes1 = fechaActual.getMonth() + 1;
      // const dia1 = fechaActual.getDate();
      // const fechaAumentadaFormateada = `${anio1}-${mes1.toString().padStart(2, '0')}-${dia1.toString().padStart(2, '0')}`;
      // this.startdate = fechaFormateada; // Imprime la fecha formateada
      // this.enddate=fechaAumentadaFormateada;
      //this.llenardates();
    }

    ngOnInit() {
      this.chanceColorFooter();
      this.route.queryParams.subscribe(params => {
        this.variable = params['variableSesiones'];
      });
      this.validateSesion();
      //this.test();
      if(this.variable){
        this.completarDatos();
      }

    }

    ionViewDidEnter() {
      //this.test();
      this.chanceColorFooter();
      this.route.queryParams.subscribe(params => {
        this.variable = params['variableSesiones'];
      });
      this.validateSesion();
      if(this.variable){
        this.completarDatos();
      }

    }
    completarDatos(){
      this.nombreSesion = this.variable.NOMBRESESION;
      this.objetivoSesion=this.variable.OBJETIVOSESION;
      this.imagePortada=this.variable.IMAGESESION;
      this.observacionSesion = this.variable.OBSERVACIONSESION;
      this.visibilidaSesion =this.variable.STATUSSESION+"";
      if(this.variable.IDOBJETIVOSPERSONALESSESION!==null)
      this.ObjetivoPersonal =this.variable.IDOBJETIVOSPERSONALESSESION;
      if(this.variable.IDFRECUENCIASESION!==null)
      this.FrecuenciaPersonales=this.variable.IDFRECUENCIASESION ;
      if(this.variable.IDPROFESIONSESION!==null)
      this.profesion=this.variable.IDPROFESIONSESION ;
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
      if(this.dataRtuinas){
      const rutinas = this.dataRtuinas;
      if (Array.isArray(rutinas)) {
        for (let i = 0; i < rutinas.length; i++) {
          const videoName = rutinas[i].IMAGENRUTINA;
          const imageUrl = this.ip_address+'/media/rutinas/portadasrutinas/'+videoName;
          imageUrls.push(imageUrl);
        }
      }}
      //console.log(ejercicios);

      const imageUrlAdd = this.ip_address+'/media/sesiones/crear_sesion.jpg';
      imageUrls.push(imageUrlAdd);
      if (this.imagePortada){
        const imageUrlAdd2 = this.ip_address+'/media/sesiones/portadassesiones/'+this.imagePortada;
        imageUrls.push(imageUrlAdd2);
      }
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
      this.obtenerEntrenadoresBasic();
      this.obtenerObjetivosPersonales();
      this.obtenerFrecuencia();
      this.obtenerProfesion();
      //this.obteneUsuariosBasic();
      this.obtenerEjercicios();
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
                this.obtenerEntrenadoresBasic();
                this.obtenerFrecuencia();
                this.obtenerProfesion();
                this.obtenerObjetivosPersonales();
                //this.obteneUsuariosBasic();
                this.StatusBar();
                this.obtenerEjercicios();
                this.obtenerRutinas();
                if(this.variable.IDOBJETIVOSPERSONALESSESION!==null){
                  this.obtenerRutinasbyObjetive(this.variable.IDOBJETIVOSPERSONALESSESION);
                  this.filterdataRutinasporSesion();
                }
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
    handleCheckboxChange(data: any, event: any) {
      if (event.target.checked) {
        this.dataUsersSesiones.push(data);
      } else {
        const index = this.dataUsersSesiones.findIndex((item: any) => item.IDPERSONA === data.IDPERSONA);
        if (index !== -1) {
          this.dataUsersSesiones.splice(index, 1); // Eliminar del array cuando el checkbox es deseleccionado
        }
      }
    }

    isCheckboxSelected(data: any): boolean {
      return this.dataUsersSesiones.some((item: any) => item.IDPERSONA === data.IDPERSONA);
    }
    getfirstName(url: string): string {
      return url.split(' ')[0];
    }
/*     showTab(tabNumber: number) {
      this.currentTab = tabNumber;
      if(tabNumber===2){
        this.obtenerObjetivosPersonales();
        this.ObjetivoPersonal="";
      }else{
        if(this.dataRutinasporSesion.length===0){
        this.dateinitialicedEnd=false;
        this.dateinitialicedStart=false;}
        else{
          this.dateinitialicedStart=true;
          this.dateinitialicedEnd=true;
          this.enddate=this.sumarDias(this.startdate,this.dataRutinasporSesion.length);
        }
        this.obtenerRutinas();
      }
    } */
   /*  isTabSelected(tabNumber: number): boolean {
      return this.currentTab === tabNumber;
    } */

    selectObjetiveFuntion(){
      if(this.ObjetivoPersonal!==""){
        this.obtenerRutinasbyObjetive(Number(this.ObjetivoPersonal));
        this.filterdataRutinasporSesion();
      }else{
        this.obtenerRutinas();
      }

    }
    filterdataRutinasporSesion(){
      this.dataRutinasporSesion = this.dataRutinasporSesion.filter(item => item.IDOBJETIVOSPERSONALESRUTINA === this.ObjetivoPersonal);
      if (this.dataRutinasporSesion.length>0){
        this.dataRutinasporSesion.forEach(item => {
          // Accede a la propiedad DURACIONRUTINA y realiza la suma en otra función
          const duracion = item.DURACIONRUTINA;
          this.duracionSesion= this.sumarTiempos("",duracion);
        });
      }else{
        this.duracionSesion="00:00:00";
      }

    }
    /* openCalendar(calendarType:number) {
      if(this.dateinitialicedStart===false){
        this.dateinitialicedStart=true;
      }
      else if(this.dateinitialicedEnd===false){
        this.dateinitialicedEnd=true;
      }
      if (calendarType === 1) {
        this.showCalendarStart = true;
      } else if (calendarType === 2) {
        this.showCalendarEnd = true;
      }
    }
    cancelCalendar(calendarType:number) {
      this.llenardates();

      if (calendarType === 1) {
        this.showCalendarStart = false;
      } else if (calendarType === 2) {
        this.showCalendarEnd = false;
      }
    }

    llenardates(){
      if(this.dateinitialicedEnd===false || (this.startdate>this.enddate)){
        this.highlightedDates = [
          {
            date: this.startdate,
            textColor: '#843dff',
            backgroundColor: '#c2b5fd',
          }]
      }else{
        this.highlightedDates = this.generateColorArray(this.startdate, this.enddate, "#c2b5fd", "#a48bfa");
      }
      setTimeout(() => {
        const elementoDestino = document.getElementById('elemento-destino-horario');
        if (elementoDestino) {
          elementoDestino.scrollIntoView({ behavior: 'smooth' });
        }
      }, 50);
    }

    compareDates(startDate: Date, endDate: Date): boolean {
      return startDate <= endDate;
    } */

    // colorearAgain(){
    //   this.highlightedDates = this.generateColorArray(this.startdate, this.enddate, "#c2b5fd", "#a48bfa");
    // }

    // generateColorArray(startDateString: string, endDateString: string, startColor: string, endColor: string): any[] {
    //   const startDate = new Date(startDateString);
    //   const endDate = new Date(endDateString);
    //   const numDays = Math.round((endDate.getTime() - startDate.getTime()) / (24 * 60 * 60 * 1000));

    //   const startRGB = this.hexToRGB(startColor);
    //   const endRGB = this.hexToRGB(endColor);

    //   const colorArray = [];

    //   for (let i = 0; i <= numDays; i++) {
    //     const currentDate = new Date(startDate.getTime() + i * (24 * 60 * 60 * 1000));
    //     const colorRatio = i / numDays;

    //     const r = Math.round(startRGB.r + (endRGB.r - startRGB.r) * colorRatio);
    //     const g = Math.round(startRGB.g + (endRGB.g - startRGB.g) * colorRatio);
    //     const b = Math.round(startRGB.b + (endRGB.b - startRGB.b) * colorRatio);
    //     const textColor = this.RGBToHex(r, g, b);

    //     const dateString = currentDate.toISOString().split('T')[0]; // Obtener fecha en formato 'yyyy-mm-dd'

    //     colorArray.push({
    //       date: dateString,
    //       backgroundColor: textColor,
    //       textColor: "#843dff",
    //     });
    //   }

    //   return colorArray;
    // }

    // hexToRGB(hex: string): { r: number; g: number; b: number } {
    //   const bigint = parseInt(hex.replace("#", ""), 16);
    //   const r = (bigint >> 16) & 255;
    //   const g = (bigint >> 8) & 255;
    //   const b = bigint & 255;
    //   return { r, g, b };
    // }

    // RGBToHex(r: number, g: number, b: number): string {
    //   return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
    // }
    go_page(name: string){
      //this.router.navigate(['/'+name], { state: { previousPage: 'crear-ejercicio' } });
      //this.navController.navigateForward('/'+name);
      this.navController.navigateForward('/' + name, {
        queryParams: {
          variableRutinas: ""
        }
      });
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

    async confirmchangeCreateData(){
      let flag=false;
      let flag2=false;
      if(this.visibilidaSesion === "1") {
        this.observacionSesion="N/A";
        flag2=true;
      }else if(this.visibilidaSesion === "0" && this.observacionSesion==="N/A"){
        this.presentCustomToast("Debe escribiar las Razon de Inactividad","danger");
        flag2=false;
      }else{
        flag2=true;
      }
      if(this.dataRutinasporSesion && this.dataRutinasporSesion.length>0 && flag2){
        if (this.dataRutinasporSesion.length==1){
          if((this.ObjetivoPersonal!== "" || this.profesion!== "" || this.FrecuenciaPersonales!== "") && this.visibilidaSesion!=="" && this.observacionSesion!=="") {
            flag=true;
          }else{
          flag=false;}
        }else{
            if(this.selectedTrainerBasic && this.nombreSesion !=="" && this.visibilidaSesion!=="" && this.objetivoSesion!==""
            && (this.ObjetivoPersonal!== "" || this.profesion!== "" || this.FrecuenciaPersonales!== "") && this.observacionSesion!=="" ){
              flag=true;
            }else{
              flag=false;
            }
        }
      }else{
        this.presentCustomToast("Debe Obtener al menos 1 Rutina","danger");
      }
      if(flag){
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
                this.dataSesiones={
                  USUARIOCREACIONSESION : this.userSesionPerfil[0].IDPERSONA,
                  STATUSSESION: Number(this.visibilidaSesion),
                  OBSERVACIONSESION: this.observacionSesion,
                  ID_RUTINAS_SESION: this.dataRutinasporSesion.map(elemento => elemento.IDRUTINA).join(',')
                }
                if(this.nombreSesion!=="" && this.objetivoSesion!=="" ){
                  this.dataSesiones.NOMBRESESION= this.nombreSesion;
                  this.dataSesiones.OBJETIVOSESION= this.objetivoSesion;
                }else{
                  this.dataSesiones.NOMBRESESION=this.dataRutinasporSesion[0].NOMBRERUTINA;
                  this.dataSesiones.OBJETIVOSESION= null;
                }
                if (this.dataRutinasporSesion.length===1){
                  this.dataSesiones.IDENTRENADOR= this.dataRutinasporSesion[0].IDENTRENADOR;
                  this.dataSesiones.OBJETIVOSESION= null;
                }else{
                  this.dataSesiones.IDENTRENADOR= this.selectedTrainerBasic.IDPERSONA;
                }
                if (this.FrecuenciaPersonales!==""){
                  this.dataSesiones.IDFRECUENCIASESION =Number(this.FrecuenciaPersonales);
                }else{
                  this.dataSesiones.IDFRECUENCIASESION =null;
                }
                if (this.profesion!==""){
                  this.dataSesiones.IDPROFESIONSESION=Number(this.profesion);
                }else{
                  this.dataSesiones.IDPROFESIONSESION=null;
                }
                if(this.ObjetivoPersonal!==""){
                  this.dataSesiones.IDOBJETIVOSPERSONALESSESION= Number(this.ObjetivoPersonal);
                }else{
                  this.dataSesiones.IDOBJETIVOSPERSONALESSESION=null;
                }
                if(this.variable){
                  this.dataSesiones.USUARIOMODIFICACIONSESION=this.userSesionPerfil[0].IDPERSONA,
                  this.dataSesiones.IDSESION=this.variable.IDSESION;
                }
                 if(this.selectedFile && this.dataRutinasporSesion.length>1){
                  this.dataSesiones.IMAGESESION= this.sanitizeFileName(this.nombreSesion)+".jpg";
                  this.updateFileImage(this.dataSesiones.IMAGESESION)
                  .then((fileName)=>{
                    this.dataSesiones.IMAGESESION=fileName+".jpg";
                    if(this.variable){
                      this.UpdateData(this.dataSesiones);
                    }else{
                      this.CreateData(this.dataSesiones);
                    }
                  });
                }else{
                  if(!this.selectedFile && this.dataRutinasporSesion.length===1){
                    this.dataSesiones.IMAGESESION= this.sanitizeFileName(this.dataSesiones.NOMBRESESION)+".jpg";
                    this.copyFileRutinawithSesionesPortadas(this.dataSesiones.IMAGESESION, this.dataRutinasporSesion[0].IMAGENRUTINA)
                    .then((newFileName) => {
                      this.dataSesiones.IMAGESESION = newFileName;
                      if(this.variable){
                        this.UpdateData(this.dataSesiones);
                      }else{
                        this.CreateData(this.dataSesiones);
                      }
                    });
                  }else{
                    if(this.variable){
                      this.dataSesiones.IMAGESESION = this.variable.IMAGESESION;
                      this.UpdateData(this.dataSesiones);
                    }else{
                      this.CreateData(this.dataSesiones);
                    }
                  }

                }


              }
            }
          ]
        });
        await alert.present();
      }

      else
        this.presentCustomToast("Debe llenar todos los Campos","danger");
    }

    sanitizeFileName(fileName:string) {
      const sanitizedText = fileName
        .toLowerCase()
        .replace(/\s+/g, "_")
        .replace(/[^a-z0-9_.-]/g, "");

      return sanitizedText ;
    }

    async CreateData(data:any) {
      try {
        //this.loading=true;
        const response = await this.apiService.CreteDataSesion(data).toPromise();
        this.loading=false;
        this.presentCustomToast(response.message, "success");
        this.ngOnInit();
        this.go_page('sesiones');
      } catch (error:any) {
        this.presentCustomToast(error.error.errror, "danger");
      }
    }
    async UpdateData(data:any) {
      try {
        //this.loading=true;
        const response = await this.apiService.UpdateDataSesion(data).toPromise();
        this.loading=false;
        this.presentCustomToast(response.message, "success");
        this.ngOnInit();
        this.go_page('sesiones');
      } catch (error:any) {
        this.presentCustomToast(error.error.errror, "danger");
      }
    }

    updateFileImage(filename:string): Promise<string> {
      return new Promise((resolve, reject) => {
        this.loading=true;
        if (this.selectedFile) {
          this.apiService.uploadcaptureImagenSesiones(this.selectedFile, filename).subscribe(
            (response) => {
              this.selectedFile = null;
              resolve(response.fileName); // Resuelve la promesa con el valor del fileName
            },
            (error) => {
              reject(error.error.error); // Rechaza la promesa con el error recibido
            }
          );
        } else {
          reject("Portada de Rutina No seleccionada"); // Rechaza la promesa con el mensaje de error personalizado
        }
      });
    }

    getVideoName(url: string): string {
      return url.split('.')[0];
    }


    cargarDatos(nameData:string){
     if(nameData==="dataTrainerBasic"){
        const rawData = this.dataTrainerBasic;
        this.selectData = rawData.map(item => ({ ...item }));
      }
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
    enfocarenRutinasporSesion(){
      const index=this.dataRutinasporSesion.length as number;
      setTimeout(() => {
        const elementoDestino = document.getElementById('elemento-sesionesrutinas' + (index -1));
        if (elementoDestino) {
          elementoDestino.scrollIntoView({ behavior: 'smooth' });
        }
      }, 50);
    }
    showEjerciciosxItemExt(data: any, index: number) {
      this.mostrarEjerciciosSelectExt[index] = !this.mostrarEjerciciosSelectExt[index];
      if (this.mostrarEjerciciosSelectExt[index] ===true){
        setTimeout(() => {
          const elementoDestino = document.getElementById('elemento-destino-ext-' + index);
          if (elementoDestino) {
            elementoDestino.scrollIntoView({ behavior: 'smooth' });
          }
        }, 50);
      }
    }
    handleReorder(ev: CustomEvent<ItemReorderEventDetail>) {
      const itemToMove = this.dataRutinasporSesion[ev.detail.from]; // Guardamos el elemento que queremos mover en una variable temporal
      this.dataRutinasporSesion.splice(ev.detail.from, 1);
      this.dataRutinasporSesion.splice(ev.detail.to, 0, itemToMove);
      ev.detail.complete();
    }
    RemoveItemERequerido(index:number){
      this.duracionSesion=this.restarTiempos(this.duracionSesion,this.dataRutinasporSesion[index].DURACIONRUTINA);
      this.dataRutinasporSesion.splice(index, 1);
      //this.updateEndDate();
    }

    cancelarmostrarSelecEjercicio(){
      this.mostrarRutinasporSesion=!this.mostrarRutinasporSesion;
      if(this.dataRutinasporSesionUniq ){
        this.duracionSesion=this.duracionSesionOrig;
      }
      this.dataRutinasporSesionUniq=null;
      this.duracionSesionOrig="";
    }
    EditItemERequerido(data:any,index:number){
      this.duracionSesion = this.restarTiempos(this.duracionSesion,data.DURACIONRUTINA);
      this.index=index;
      this.dataRutinasporSesionUniq=data as any;
      this.mostrarRutinasporSesion=!this.mostrarRutinasporSesion;
      const rawData = this.dataRtuinas;
      this.selectData = rawData.map(item => ({ ...item }));
    }
    showSelected(nameData:string){
      this.searchTerm="";
       if(nameData==="dataTrainerBasic"){
        this.mostrarTrainerBasic=!this.mostrarTrainerBasic;
        const rawData = this.dataTrainerBasic;
        this.selectData = rawData.map(item => ({ ...item }));
      }else if (nameData==="dataUsuariosBasic"){
        const rawData2 = this.dataUsersSesiones;
        this.dataUsersSesionesOrigin = rawData2.map(item => ({ ...item }));
        this.mostrarUsuariosBasic=!this.mostrarUsuariosBasic;
        const rawData = this.dataUsuariosBasic;
        this.selectData = rawData.map(item => ({ ...item }));
      }if(nameData==="dataRutinasporSesiones"){
        if(!this.dataRutinasporSesion){
          this.dataRutinasporSesion=[];
        }
        this.mostrarRutinasporSesion=!this.mostrarRutinasporSesion;
        const rawData = this.dataRtuinas;
        this.selectData = rawData.map(item => ({ ...item }));
      }
    }
    findEjercicioRutina(IDEJERCICIORUTINA: number): any {
      const elemento = this.dataEjercicio.find(objeto => objeto.IDEJERCICIO === IDEJERCICIORUTINA);
      return elemento;
    }
    canceldataUsuariosBasic(){
      this.dataUsersSesiones=this.dataUsersSesionesOrigin;
      this.dataUsersSesionesOrigin=[];
      this.mostrarUsuariosBasic=!this.mostrarUsuariosBasic;
    }
    confirmdataUsuariosBasic(){
      this.mostrarUsuariosBasic=!this.mostrarUsuariosBasic;
      this.dataUsersSesionesOrigin=[];
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
      this.duracionSesionOrig =timeOrig;
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

    selectItem(title: any,nameData:string) {
      if(this.selectData){
        this.selectData=[]
      }
      // if(this.dateinitialicedEnd==false){
      //   this.dateinitialicedEnd=true;
      // }
     if(nameData==="dataTrainerBasic"){
        this.selectedTrainerBasic = title;
        this.mostrarTrainerBasic = false;
     }else if(nameData=="dataRutinasporSesiones"){
      if(this.dataRutinasporSesionUniq === null || this.dataRutinasporSesionUniq === undefined){
        this.dataRutinasporSesionUniq=null;
        this.index=-1;
        this.duracionSesion=this.sumarTiempos(this.duracionSesion,title.DURACIONRUTINA);
        this.dataRutinasporSesion.push(title);
        this.mostrarRutinasporSesion = false;
      }else{
        this.replaceLastWithIndex(title,this.index);
        this.duracionSesion=this.sumarTiempos(this.duracionSesion,title.DURACIONRUTINA);
        this.duracionSesionOrig="";
        this.mostrarRutinasporSesion = false;
        this.dataRutinasporSesionUniq={};
        this.index=-1;
      }
      //this.updateEndDate();
      //this.llenardates();
      this.enfocarenRutinasporSesion();
     }
    }
    obtenerDiferenciaEnDias(fechaInicio: string, fechaFin: string): number {
      const fechaInicioMs = new Date(fechaInicio).getTime();
      const fechaFinMs = new Date(fechaFin).getTime();
      const diferenciaMs = fechaFinMs - fechaInicioMs;
      const diferenciaDias = Math.floor(diferenciaMs / (1000 * 60 * 60 * 24));
      return diferenciaDias;
    }

    // updateEndDate(){
    //   if (this.dateinitialicedEnd && this.dataRutinasporSesion.length>0)
    //   this.enddate=this.sumarDias( this.startdate,this.dataRutinasporSesion.length);
    //   else if( this.dataRutinasporSesion.length===0)
    //   this.dateinitialicedEnd=false;
    //   this.llenardates();
    // }

     sumarDias(fechaString: string, dias: number): string {
      const fecha = new Date(fechaString);
      fecha.setDate(fecha.getDate() + dias);

      const anio = fecha.getFullYear();
      const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
      const dia = fecha.getDate().toString().padStart(2, '0');

      return `${anio}-${mes}-${dia}`;
    }
    splitFecha(fecha: string): string[] {
      return fecha.split('-');
    }
    obtenerNombreMes(numeroMes: string): string {
      const meses = [
        'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
        'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'
      ];

      const numMes = parseInt(numeroMes, 10);

      if (!isNaN(numMes) && numMes >= 1 && numMes <= 12) {
        return meses[numMes - 1];
      } else {
        return '';
      }
    }
    replaceLastWithIndex(newData: any, replacementIndex: number) {
      this.dataRutinasporSesion[replacementIndex]=newData;
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

        if(nameData==="dataTrainerBasic"){
          for (const term of searchTerms) {
            const filteredItems = this.selectData.filter(item =>
              item.NOMBREPERSONA.toLowerCase().includes(term) ||
              item.APELLDOPERSONA.toLowerCase().includes(term)
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

    obtenerGetPerfilCompleto(nickname:string){
      this.apiService.connsultPerfilCompleto(nickname).subscribe(
        (response) => {
          this.userSesionPerfil=response;
          console.log(this.userSesionPerfil);
        },
        (error) => {
          this.presentCustomToast(error.error.error,"danger");
        }
      );
    };

    copyFileRutinawithSesionesPortadas(newname: string, oldname: string): Promise<string> {
      return new Promise((resolve, reject) => {
        this.loading=true;
        this.apiService.copyPortadasRutinas(newname, oldname).subscribe(
          (response) => {
            //this.presentCustomToast(response.message, "success");
            resolve(response.newFileName);
          },
          (error) => {
            this.presentCustomToast(error.error.error, "danger");
            reject(error);
          }
        );
      });
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
    obteneUsuariosBasic(){
      this.apiService.allEntrenantes().subscribe(
        (response) => {
          this.dataUsuariosBasic=response;
        },
        (error) => {
          this.presentCustomToast(error.error.error,"danger");
        }
      );
    }
    obtenerRutinas(){
      this.apiService.getRutinasActivate().subscribe(
        (response) => {
          this.dataRtuinas=response;
          this.dataRtuinas = this.dataRtuinas.map(objeto => ({
            ...objeto,
            IDEJERCICIOS: objeto.IDEJERCICIOS.split(",").map(Number)
          }));
          if(this.variable){
            this.dataRutinasporSesion = this.variable.IDRUTINAS.map((IDRUTINAS: number) => this.dataRtuinas.find(rutina => rutina.IDRUTINA === IDRUTINAS));
            this.dataRutinasporSesion.forEach((item) => {
              this.duracionSesion =  this.sumarTiempos(this.duracionSesion,item.DURACIONRUTINA);
            });
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
    obtenerRutinasbyObjetive(idObjetive:Number){
      this.apiService.getRutinasActivatebyObjetive(idObjetive).subscribe(
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

    obtenerObjetivosPersonales(){
      this.apiService.allObjetivosPersonales().subscribe(
        (response) => {
          this.dataObjetivosPersonales=response;
        },
        (error) => {
          this.presentCustomToast(error.error.error,"danger");
        }
      );
    }
    obtenerFrecuencia(){
      this.apiService.allfrecuenciaejercicio().subscribe(
        (response) => {
          this.dataFrecuenciaPersonales=response;

        },
        (error) => {
          this.presentCustomToast(error.error.error,"danger");
        }
      );
    }
    obtenerProfesion(){
      this.apiService.allprofesion().subscribe(
        (response) => {
          this.dataProfesion=response;
        },
        (error) => {
          this.presentCustomToast(error.error.error,"danger");
        }
      );
    }

    handleFileInput(event: any) {
      const file = event.target.files[0];
      if (!file.type.includes('image/jpeg')) {
        return;
      }

      // Validar el tamaño del archivo
      if (file.size > 1024 * 1024*2) {
        this.presentCustomToast("Imagen no puede ser mayor de 2MB", "danger");
        return;
      }

      this.selectedFile = file;
      this.nameFile = file.name;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.selectedImageUrl = e.target.result;
        this.imagePortada="";
        this.presentCustomToast("Imagen seleccionada correctamente", "success");
      };
      reader.readAsDataURL(file);
    }

    uploadImage() {
      this.fileInputRef.nativeElement.click();
    }

}
