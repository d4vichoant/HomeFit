import { Component, OnInit,  ViewChild, ElementRef,NgZone } from '@angular/core';
import { IP_ADDRESS } from '../../../constantes';
import { ApiServiceService } from '../../../api-service.service';
import { StatusBar } from '@capacitor/status-bar';
import { Storage } from '@ionic/storage-angular';
import { AlertController, NavController, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-crear-multimedia',
  templateUrl: './crear-multimedia.page.html',
  styleUrls: ['./crear-multimedia.page.scss'],
})
export class CrearMultimediaPage implements OnInit   {
  @ViewChild('videoPlayer', { static: false }) videoPlayer!: ElementRef;
  //@ViewChild('videoPlayer') videoPlayer!: ElementRef;

  public loading = true;
  public ip_address = IP_ADDRESS;

  public dataMultimedia!: any[];
  public dataMultimediaUniq!: any;
  selectedFile: File | null = null;
  nameFile:string='';
  imagenFile: File | null = null;

  public userSesion!:string;
  public userSesionPerfil!:any;

  public selectData!: any[];
  public searchTerm:string="";
  private previousSearchTerm: string = '';

  private originData!:any[];

  public mostrarImagen:boolean=false;
  public mostrarSelect:boolean=false;
  public mostrarSelectEdit:boolean=false;
  public mostrarSelectCreate:boolean=false;

  showheader:boolean=true;
  public readonlyvalue: boolean = false;
  dataSelect: any[] = [
    { id: 1, nombre: 'Activo' },
    { id: 0, nombre: 'Inactivo' },
    { id: 2, nombre: 'Revisión' },
  ];

  public filter: any[]=[
    {
      name: 'Inactivo',
      iconstatus: false,
    }, {
      name: 'Activo',
      iconstatus: false,
    },{
      name: 'Revisión',
      iconstatus: false,
    }];

  constructor(private storage: Storage,
    private apiService: ApiServiceService,
    private navController: NavController,
    public toastController: ToastController,
    private router: Router,
    public alertController: AlertController,
    private ngZone: NgZone) { }

    ionViewDidEnter(){
      this.validateSesion();
      //this.cargarImagenesBefores();
      //this.test()
    }
    ngOnInit() {
      this.validateSesion();
      //this.cargarImagenesBefores();
      //this.test()
    }

    AfterViewChecked() {

    }

    test(){
      this.obtenerMultimedia();
      this.loading=false;
      this.AfterViewChecked();
    }
    StatusBar(){
      StatusBar.hide();
      StatusBar.setOverlaysWebView({ overlay: true });
      StatusBar.setBackgroundColor({ color: '#ffffff' });
    }
    validateSesion(){
      try{
        this.storage.get('sesion').then((sesion) => {
          if (sesion && JSON.parse(sesion).rolUsuario == 99 || JSON.parse(sesion).rolUsuario == 2) {
            this.userSesion = JSON.parse(sesion).nickname;
            this.obtenerGetPerfilCompleto(this.userSesion);
            this.apiService.protectedRequestWithToken(JSON.parse(sesion).token).subscribe(
              (response) => {
                this.chanceColorFooter();
                this.AfterViewChecked();
                this.StatusBar();
                this.obtenerMultimedia();
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

    cargarImagenesBefores(){
      const ejercicios = this.dataMultimedia; // Obtén el array de ejercicios
      const imageUrls = []; // Array para almacenar las URL de las imágenes
      if (Array.isArray(ejercicios)) {
        for (let i = 0; i < ejercicios.length; i++) {
          const videoName = this.getVideoName(ejercicios[i].ALMACENAMIENTOMULTIMEDIA);
          const imageUrl = this.ip_address+'/multimedia/'+videoName+'.jpg';
          imageUrls.push(imageUrl);
        }
      }
      const imageUrlAdd = this.ip_address+'/media/images/crear_Multimedia.jpg';
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
      this.navController.navigateForward('/'+name);
    }

    goBackToPreviousPage() {
      // Retrieve the previous page information from state
      const state = window.history.state;
      if (state && state.previousPage) {
        // Navigate back to the previous page
        this.router.navigateByUrl(state.previousPage);
      } else {
        // Handle the case when no previous page information is available
        // You can navigate to a default page or show an error message
      }
    }
    public onInputChange(event: any) {
      const currentSearchTerm = event.target.value;
      if (this.previousSearchTerm && currentSearchTerm.length < this.previousSearchTerm.length) {
        this.dataMultimedia=this.selectData;
      }
      this.previousSearchTerm = currentSearchTerm;
      this.filterItems();
    }
    private filterItems() {
      if (!this.selectData) {
        const rawData = this.dataMultimedia;
        this.selectData = rawData.map(item => ({ ...item }));
      }
      const searchTerms = this.searchTerm.toLowerCase().trim().split(' ');
      if (searchTerms.length >= 1) {
        let filteredArray: any[] = [];
          for (const term of searchTerms) {
            const filteredItems = this.selectData.filter(item =>
              item.TITULOMULTIMEDIA.toLowerCase().includes(term)||
              item.DESCRIPCIONMULTIMEDIA.toLowerCase().includes(term)||
              item.ALMACENAMIENTOMULTIMEDIA.toLowerCase().includes(term) ||
              this.getESTADO(item.STATUSMULTIMEDIA).toLowerCase().includes(term)||
              item.OBSERVACIONMULTIMEDIA.toLowerCase().includes(term)
            );
            filteredArray = filteredArray.concat(filteredItems);
          }
        // Eliminar duplicados del array filtrado
        this.dataMultimedia = Array.from(new Set(filteredArray));
      }
    }
    public getESTADO(status:number):string{
      switch (status) {
        case 1:
          return 'Activo';
        case 0:
          return 'Inactivo';
        case 2:
          return 'Revisión';
        default:
          return '';
      }
    }
    getVideoName(url: string): string {
      return url.split('.')[0];
    }
    showSelect(item:any, nombre:string)
    {
      this.showheader=false;
      const rawData = this.dataMultimedia;
      this.originData = rawData.map(item => ({ ...item }));
      this.mostrarSelect=!this.mostrarSelect;
      this.dataMultimediaUniq=item;
    }
    showSelectEdit(item:any, nombre:string)
    {
      this.showheader=false;
      if (item){
        const rawData = this.dataMultimedia;
        this.originData = rawData.map(item => ({ ...item }));
        this.mostrarSelectEdit=!this.mostrarSelectEdit;
        this.dataMultimediaUniq=item;
        const rawDat1 = this.dataMultimediaUniq.ALMACENAMIENTOMULTIMEDIA;
        this.nameFile= rawDat1;
      }else{
        this.dataMultimediaUniq = {};
        this.dataMultimediaUniq.STATUSMULTIMEDIA="";
        this.mostrarSelectCreate=!this.mostrarSelectCreate;
        this.nameFile= '';
      }
    }
    cancelprocess(){
      this.showheader=true;
      this.dataMultimediaUniq={};
      this.dataMultimedia=this.originData;
      this.mostrarSelect=!this.mostrarSelect;
      this.presentCustomToast('Proceso Cancelado',"danger");
    }
    cancelprocessEdit(){
      this.showheader=true;
      this.dataMultimediaUniq={};
      this.dataMultimedia=this.originData;
      this.mostrarSelectEdit=!this.mostrarSelectEdit;
      this.presentCustomToast('Proceso Cancelado',"danger");
    }
    cancelprocessCreate(){
      this.showheader=true;
      this.dataMultimediaUniq={};
      this.mostrarSelectCreate=!this.mostrarSelectCreate;
      this.presentCustomToast('Proceso Cancelado',"danger");
    }
    handleFileInput(event: any) {
      const file = event.target.files[0];
      this.selectedFile = file;
      this.nameFile = file.name;
      this.presentCustomToast("Archivo subido correctamente", "success");

      const videoURL = URL.createObjectURL(file);
      //const videoURL: string = this.ip_address+"/multimedia/"+this.dataMultimediaUniq.ALMACENAMIENTOMULTIMEDIA;
      this.videoPlayer.nativeElement.src = videoURL;

      const videoElement: HTMLVideoElement = this.videoPlayer.nativeElement;
      videoElement.addEventListener("loadedmetadata", () => {
        const durationInSeconds = videoElement.duration;
        const durationFormatted = this.formatVideoDuration(durationInSeconds);
        this.dataMultimediaUniq.TIEMPOMULTIMEDIA = durationFormatted; // Asigna el valor a la variable videoDuration
      });

    }
    formatVideoDuration(durationInSeconds: number): string {
      const hours = Math.floor(durationInSeconds / 3600);
      const minutes = Math.floor((durationInSeconds % 3600) / 60);
      const seconds = Math.floor(durationInSeconds % 60);
      return `${this.pad(hours)}:${this.pad(minutes)}:${this.pad(seconds)}`;
    }

    pad(value: number): string {
      return value.toString().padStart(2, "0");
    }

    captureImage(video: HTMLVideoElement) {
      if (this.mostrarImagen) {
        this.mostrarImagen = false;
        setTimeout(() => {
          this.mostrarImagen = true;
        }, 0);
      }

      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');

      if (context) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        canvas.toBlob((blob) => {
          if (blob) {
            const capturedImage = new File([blob], 'captured-image.jpg', { type: 'image/png' });

            this.ngZone.run(() => {
              this.imagenFile = capturedImage;
              this.mostrarImagen = !this.mostrarImagen;
            });

            // ...
          } else {
            // ...
          }
        }, 'image/png');
      } else {
        // ...
      }
    }

    getImagenURL(imagenFile: File): string {
      return URL.createObjectURL(imagenFile);
    }

    truncateString(inputString: string): string {
      if (inputString.length <= 21) {
        return inputString;
      } else {
        const truncatedString = ".." + inputString.substring(inputString.length - 21);
        return truncatedString;
      }
    }

    async confirmchangeStatus(item:any, nombre:string) {
      if(item.OBSERVACIONMULTIMEDIA ==="N/A"  && item.STATUSMULTIMEDIA !== 1){
        this.presentCustomToast('Debe escribir alguna razon',"danger");
      }else{
        const alert = await this.alertController.create({
          header: 'Confirmar Estado',
          message: '¿Estás seguro que desea realizar este cambio en Estado de '+nombre+'?',
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
                if(item.STATUSMULTIMEDIA === 1 ){
                  item.OBSERVACIONMULTIMEDIA="N/A";
                }
                this.changeStatus(item,nombre);
                this.mostrarSelect=!this.mostrarSelect;
              }
            }
          ]
        });
        await alert.present();
      }
    }
    changeStatus(item:any, nombre:string)
    {
      this.apiService.UpdataStatus(item,nombre).subscribe(
        (response) => {
          this.presentCustomToast(response.message,"success");
          this.originData=[];
          this.showheader=true;
          this.ngOnInit();
        },
        (error) => {
          this.presentCustomToast(error.error.error,"danger");
        }
      );
    }
    async confirmUpdateDates(item:any, nombre:string) {
      if(item.OBSERVACIONMULTIMEDIA ==="N/A"  && item.STATUSMULTIMEDIA !== 1){
        this.presentCustomToast('Debe escribir alguna razon',"danger");
      }else{
        if(this.imagenFile){
            const alert = await this.alertController.create({
              header: 'Confirmar Actualizar Datos',
              message: '¿Estás seguro que desea realizar estos cambios en '+nombre+'?',
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
                  if(this.imagenFile){
                    this.saveImageFile();
                  }
                  if(item.STATUSMULTIMEDIA === 1 ){
                    item.OBSERVACIONMULTIMEDIA="N/A";
                  }
                    if(this.selectedFile){
                      this.UpdateFile().then((fileName) => {
                        item.ALMACENAMIENTOMULTIMEDIA= fileName;
                        this.UpdateDates(item,nombre);
                        this.mostrarSelectEdit=!this.mostrarSelectEdit;
                      }).catch((error) => {
                        console.error("Error al subir el archivo:", error);
                      });
                    //this.dataMultimediaUniq.ALMACENAMIENTOMULTIMEDIA = this.sanitizeFileName(this.dataMultimediaUniq.TITULOMULTIMEDIA)+".mp4";
                  }else{
                    this.UpdateDates(item,nombre);
                    this.mostrarSelectEdit=!this.mostrarSelectEdit;
                  }
                }
              }
            ]
          });
          await alert.present();
        }else{
          const alert = await this.alertController.create({
            header: 'Confirmar Actualizar Datos',
            message: '¿Estás seguro que desea realizar estos cambios en '+nombre+'?',
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
                if(this.imagenFile){
                  this.saveImageFile();
                }
                if(item.STATUSMULTIMEDIA === 1 ){
                  item.OBSERVACIONMULTIMEDIA="N/A";
                }
                  if(this.selectedFile){
                    this.UpdateFile().then((fileName) => {
                      item.ALMACENAMIENTOMULTIMEDIA= fileName;
                      this.UpdateDates(item,nombre);
                      this.mostrarSelectEdit=!this.mostrarSelectEdit;
                    }).catch((error) => {
                      this.presentCustomToast("Error al subir el archivo:" +error,"danger");
                    });
                  //this.dataMultimediaUniq.ALMACENAMIENTOMULTIMEDIA = this.sanitizeFileName(this.dataMultimediaUniq.TITULOMULTIMEDIA)+".mp4";
                }else{
                  this.UpdateDates(item,nombre);
                  this.mostrarSelectEdit=!this.mostrarSelectEdit;
                }
              }
            }
          ]
        });
        await alert.present();
        }
      }
    }
    async UpdateDates(item: any, nombre: string) {
      try {
        this.loading=true;
        const response = await this.apiService.UpdataDataMultimedia(item, nombre).toPromise();
        this.loading=false;
        this.presentCustomToast(response.message, "success");
        this.originData = [];
        this.dataMultimediaUniq = {};
        this.imagenFile = null;
        this.selectedFile = null;
        this.showheader=true;
        this.ngOnInit();
      } catch (error:any) {
        this.presentCustomToast(error.error.error, "danger");
      }
    }

    async UpdateFile(): Promise<string> {
      return new Promise((resolve, reject) => {
        if (this.selectedFile) {
          this.apiService.uploadFileMp3(this.selectedFile, this.sanitizeFileName(this.dataMultimediaUniq.TITULOMULTIMEDIA) + ".mp4").subscribe(
            (response) => {
              this.loading = true;
              this.presentCustomToast(response.message, "success");
              resolve(response.fileName + ".mp4");
              this.loading = false;
            },
            (error) => {
              this.presentCustomToast(error.error.error, "danger");
              reject(error);
            }
          );
        } else {
          this.presentCustomToast("No se ha seleccionado ningún archivo", "danger");
          reject(new Error("No se ha seleccionado ningún archivo"));
        }
      });
    }

    saveImageFile() {
      if (this.imagenFile) {
        this.apiService.uploadcaptureImagen(this.imagenFile,this.sanitizeFileName(this.dataMultimediaUniq.TITULOMULTIMEDIA)+".jpg").subscribe(
          (response) => {
            this.loading=true;
            this.presentCustomToast(response.message, "success");
            this.loading=false;
          },
          (error) => {
            this.presentCustomToast(error.error.error, "danger");
          }
        );
      } else {
        // Manejar caso cuando this.selectedFile es null
        this.presentCustomToast("No se ha seleccionado ningún archivo", "danger");
      }
    }
     sanitizeFileName(fileName:string) {
      const sanitizedText = fileName
        .toLowerCase()
        .replace(/\s+/g, "_")
        .replace(/[^a-z0-9_.-]/g, "");

      return sanitizedText ;
    }
    async confirmcreatesDates(item:any, nombre:string) {
      if((item.OBSERVACIONMULTIMEDIA ==="" ||item.OBSERVACIONMULTIMEDIA ==="N/A" )&& item.STATUSMULTIMEDIA !== 1){
        this.presentCustomToast('Debe escribir alguna razon',"danger");
      }else{
        if(this.imagenFile){
           const alert = await this.alertController.create({
          header: 'Confirmar Creación de Datos',
          message: '¿Estás seguro que desea guardar estos datos en '+nombre+'?',
          buttons: [
            {
              text: 'Cancelar',
              role: 'cancel',
              cssClass: 'secondary',
              handler: () => {
                this.dataMultimediaUniq={};
                this.presentCustomToast('Proceso cancelada',"danger");
              }
            }, {
              text: 'Aceptar',
              handler: () => {
                if(item.STATUSMULTIMEDIA === 1 ){
                  item.OBSERVACIONMULTIMEDIA="N/A";
                }
                if(this.imagenFile){
                  this.saveImageFile();
                }
                if(this.selectedFile){
                  this.UpdateFile().then((fileName) => {
                    item.ALMACENAMIENTOMULTIMEDIA= fileName;
                    this.createsDates(item,nombre);
                    this.mostrarSelectCreate=!this.mostrarSelectCreate;
                  }).catch((error) => {
                    this.presentCustomToast("Error al subir el archivo:"+error,"danger")
                  });
                //this.dataMultimediaUniq.ALMACENAMIENTOMULTIMEDIA = this.sanitizeFileName(this.dataMultimediaUniq.TITULOMULTIMEDIA)+".mp4";
                }else{
                  this.createsDates(item,nombre);
                  this.mostrarSelectCreate=!this.mostrarSelectCreate;
                }
              }
            }
          ]
        });
        await alert.present();
        }else{
          this.presentCustomToast('Debe existir una miniatura',"danger");
        }

      }
    }
    async createsDates(item: any, nombre: string) {
      try {
        this.loading=false;
        item.IDENTRENADORMULTIMEDIA =this.userSesionPerfil[0].IDPERSONA;
        const response = await this.apiService.CreteDataMultimedia(item, nombre).toPromise();
        this.loading=true;
        this.dataMultimediaUniq = {};
        this.presentCustomToast(response.message, "success");
        this.imagenFile = null;
        this.selectedFile = null;
        this.showheader=true;
        this.ngOnInit();
      } catch (error:any) {
        this.presentCustomToast(error.error.error, "danger");
      }
    }
    async savecopy(data:any){
      const alert = await this.alertController.create({
        header: 'Confirmar Copia',
        message: '¿Estás seguro que desea realizar una Copia de esta Multimedia',
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
              this.CreateDataCopy(data);
            }
          }
        ]
      });
      await alert.present();
    }
    async CreateDataCopy(data:any) {
      try {
        this.loading=true;
        data.IDENTRENADORMULTIMEDIA =this.userSesionPerfil[0].IDPERSONA;
        const response = await this.apiService.CreteDataMultimedia(data, 'multimedia').toPromise();
        this.loading=false;
        this.ngOnInit();
        this.presentCustomToast(response.message, "success");
      } catch (error:any) {
        this.presentCustomToast(error.error.errror, "danger");
      }
    }


    buttonfilterhabilitate(filtro:any,index:number){
      this.toggleIconStatus(index);
      if(!filtro.iconstatus){
        this.searchTerm = "";
      }else{
        this.searchTerm = filtro.name;
      }
      this.filterItems();
      this.searchTerm = "";
    }
    toggleIconStatus(index: number) {
      this.filter.forEach((item, i) => {
        if (i === index) {
          item.iconstatus = !item.iconstatus;
        } else {
          item.iconstatus = false;
        }
      });
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
    obtenerMultimedia(){
      this.apiService.getMultimedia().subscribe(
        (response) => {
          this.dataMultimedia=response;
          if (this.userSesionPerfil[0].IDROLUSUARIO===2 ){
            this.readonlyvalue=true;
            this.dataMultimedia = this.dataMultimedia.filter(element => element.IDENTRENADORMULTIMEDIA  === this.userSesionPerfil[0].IDPERSONA || element.IDROLUSUARIO   === 99 );
            this.dataMultimedia.sort((a, b) => {
              if (a.IDENTRENADORMULTIMEDIA  === this.userSesionPerfil[0].IDPERSONA && b.IDENTRENADORMULTIMEDIA  === this.userSesionPerfil[0].IDPERSONA) {
                return 0; // Mantener el orden relativo entre ellos
              } else if (a.IDENTRENADORMULTIMEDIA  ===  this.userSesionPerfil[0].IDPERSONA) {
                return -1; // Colocar a antes de b
              } else if (b.IDENTRENADORMULTIMEDIA  ===  this.userSesionPerfil[0].IDPERSONA) {
                return 1; // Colocar b antes de a
              } else {
                return 0; // No cambiar el orden entre a y b
              }
            });
          }
          //console.log(this.dataMultimedia);
          setTimeout(() => {
            this.cargarImagenesBefores();
          }, 1000);

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
}
