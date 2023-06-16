import { Component, OnInit,ElementRef, ViewChild} from '@angular/core';
import { IP_ADDRESS } from '../../../constantes';
import { ApiServiceService } from '../../../api-service.service';
import { Storage } from '@ionic/storage-angular';
import { NavController, ItemReorderEventDetail,ToastController } from '@ionic/angular';
import { StatusBar } from '@capacitor/status-bar';

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

  public dataSesiones!:any[];
  public origindata!:any[];

  public dataRtuinas!:any[];
  public dataEjercicio!:any[];

  public dataUsersSesiones: any[] = [];
  public dataUsersSesionesOrigin: any[] = [];

  public mostrarRutinasporSesion:boolean=false;
  public dataRutinasporSesion:any[]=[];
  public dataRutinasporSesionUniq!:any;

  public nombreSesion!:string;
  public objetivoSesion!:string;
  public imagePortada!:string;

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
      this.obtenerEntrenadoresBasic();
      this.obteneUsuariosBasic();
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
                this.obteneUsuariosBasic();
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

    go_page(name: string){
      //this.router.navigate(['/'+name], { state: { previousPage: 'crear-ejercicio' } });
      this.navController.navigateForward('/'+name);
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

    confirmchangeCreateData(){

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
      this.enfocarenRutinasporSesion();
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
        this.imagePortada="";
        this.presentCustomToast("Imagen seleccionada correctamente", "success");
      };
      reader.readAsDataURL(file);
    }

    uploadImage() {
      this.fileInputRef.nativeElement.click();
    }

}
