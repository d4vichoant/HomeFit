import { Component, OnInit,ViewChild,ElementRef  } from '@angular/core';
import { IP_ADDRESS } from '../../../constantes';
import { ApiServiceService } from '../../../api-service.service';
import { StatusBar } from '@capacitor/status-bar';
import { Storage } from '@ionic/storage-angular';
import { AlertController, NavController, ToastController } from '@ionic/angular';
import { IonCard } from '@ionic/angular';

@Component({
  selector: 'app-crear-erequerido',
  templateUrl: './crear-erequerido.page.html',
  styleUrls: ['./crear-erequerido.page.scss'],
})
export class CrearERequeridoPage implements OnInit {
  public loading = true;
  public ip_address = IP_ADDRESS;
  @ViewChild('fileInputRef') fileInputRef!: ElementRef;
  @ViewChild(IonCard) card!: IonCard;
  touchTimeout: any;
  public dataERequerido!: any[];
  private originData!:any[];
  public dataERequeridoUniq!:any;
  public selectData!:any[];
  public searchTerm!:string;
  public previousSearchTerm!:string;
  public mostarDialogEdit:boolean=false;


  selectedFile: File | null = null;
  nameFile:string='';
  selectedImageUrl!:string;

  constructor(private storage: Storage,
    private apiService: ApiServiceService,
    private navController: NavController,
    public toastController: ToastController,
    public alertController: AlertController) { }

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
  test(){
    this.loading=false;
    this.obtenerEquipoRequerido();
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
          this.apiService.protectedRequestWithToken(JSON.parse(sesion).token).subscribe(
            (response) => {
              this.chanceColorFooter();
              this.StatusBar();
              this.obtenerEquipoRequerido();
              //
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
    const ejercicios = this.dataERequerido; // Obtén el array de ejercicios
    const imageUrls = []; // Array para almacenar las URL de las imágenes
    if (Array.isArray(ejercicios)) {
      for (let i = 0; i < ejercicios.length; i++) {
        const videoName = ejercicios[i].IMAGENEQUIPOREQUERIDO;
        const imageUrl = this.ip_address+'/media/equipoRequerido/'+videoName;
        imageUrls.push(imageUrl);
      }
    }
    const imageUrl = this.ip_address+'/media/equipoRequerido/plus.png';
    imageUrls.push(imageUrl);
    let imagesLoaded = 0;
    //console.log(imageUrls);
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
    this.navController.navigateForward('/'+name);
  }
  public onInputChange(event: any) {
    const currentSearchTerm = event.target.value;
    if (this.previousSearchTerm && currentSearchTerm.length < this.previousSearchTerm.length) {
      this.dataERequerido=this.selectData;
    }
    this.previousSearchTerm = currentSearchTerm;
    this.filterItems();
  }
  private filterItems() {
    if (!this.selectData) {
      const rawData = this.dataERequerido;
      this.selectData = rawData.map(item => ({ ...item }));
    }
    const searchTerms = this.searchTerm.toLowerCase().trim().split(' ');
    if (searchTerms.length >= 1) {
      let filteredArray: any[] = [];
        for (const term of searchTerms) {
          const filteredItems = this.selectData.filter(item =>
            item.NOMBREEQUIPOREQUERIDO.toLowerCase().includes(term)
          );
          filteredArray = filteredArray.concat(filteredItems);
        }
      // Eliminar duplicados del array filtrado
      this.dataERequerido = Array.from(new Set(filteredArray));
    }
  }
  showCreateDara(){
    this.mostarDialogEdit=!this.mostarDialogEdit;
    if(!this.dataERequeridoUniq){
      this.dataERequeridoUniq={};
    }
  }
  onCardTouchStart(event: TouchEvent,data:any) {
    this.touchTimeout = setTimeout(() => {
      const rawData = this.dataERequerido;
      this.originData = rawData.map(item => ({ ...item }));
      this.mostarDialogEdit=!this.mostarDialogEdit;
      this.dataERequeridoUniq=data;
    }, 1000);
  }

  changeStatusERequerido(data:any){
    if(data.STATUSEQUIPOREQUERIDO===1){
      data.STATUSEQUIPOREQUERIDO=0;
    }else{
      data.STATUSEQUIPOREQUERIDO=1;
    }
    //this.mostarDialogEdit=!this.mostarDialogEdit;
  }

  async confirmchangeStatus(item:any) {
    if(item.OBSERVACIONMULTIMEDIA ==="N/A"  && item.STATUSMULTIMEDIA !== 1){
      this.presentCustomToast('Debe escribir alguna razon',"danger");
    }else{
      const alert = await this.alertController.create({
        header: 'Confirmar Estado',
        message: '¿Estás seguro que desea realizar este cambio?',
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
              this.changeStatusERequeridoSave(item);
            }
          }
        ]
      });
      await alert.present();
    }
  }


  changeStatusERequeridoSave(data:any){
    if(data.STATUSEQUIPOREQUERIDO===1){
      data.STATUSEQUIPOREQUERIDO=0;
    }else{
      data.STATUSEQUIPOREQUERIDO=1;
    }
    this.apiService.UpdataStatus(data,"equiporequerido").subscribe(
      (response) => {
        this.presentCustomToast("Ha sido cambiado la Disponibilidad Correctamnte","success")
        //this.mostarDialogEdit=!this.mostarDialogEdit;
      },
      (error) => {
        this.presentCustomToast(error.error.error,"danger");
      }
    );
  }

  updatedatesERequerido(data:any){
    if(this.selectedFile){
      this.updateFileImage(data,this.selectedFile,this.sanitizeFileName(data.NOMBREEQUIPOREQUERIDO)+".png");
    }else{
      this.preupdatedatesERequerido(data);
    }
  }
  preupdatedatesERequerido(data:any){
    this.apiService.UpdataDataERequerido(data,"equiporequerido").subscribe(
      (response) => {
        this.presentCustomToast(response.message,"success")
        this.originData=[];
        this.mostarDialogEdit=!this.mostarDialogEdit;
        this.dataERequeridoUniq={};
        this.nameFile="";
        //location.reload();
      },
      (error) => {
        this.presentCustomToast(error.error,"danger");
      }
    );  }

  createERequerido(data:any){
    if(this.selectedFile){
      if (this.dataERequeridoUniq.STATUSEQUIPOREQUERIDO){
        if(this.dataERequeridoUniq.NOMBREEQUIPOREQUERIDO){
          this.updateFileImageCreate(data,this.selectedFile,this.sanitizeFileName(this.dataERequeridoUniq.NOMBREEQUIPOREQUERIDO)+".png");
        }else{
          this.presentCustomToast("Debe llenar Todos los campos","danger");
        }
      }else{
        this.presentCustomToast("Debe Seleccionar el estado del Equipo Activo o Inactivo","danger");
      }

    }else{
      this.presentCustomToast("Debe Subir Una Imagen","danger");
    }
  }

  precreateERequerido(data:any){
    this.apiService.CreateDataERequerido(data,"equiporequerido").subscribe(
      (response) => {
        if(this.selectedFile)
        this.presentCustomToast(response.message,"success")
        this.mostarDialogEdit=!this.mostarDialogEdit;
        this.dataERequeridoUniq={};
      },
      (error) => {
        this.presentCustomToast(error.error,"danger");
      }
    );
  }

  updateFileImage(data:any,file: File,filename :string){
    this.apiService.uploadcaptureImagenERequerido(file,filename).subscribe(
      (response) => {
        data.OBSERVACIONEQUIPOREQUERIDO="N/A";
        data.IMAGENEQUIPOREQUERIDO = response.fileNameNew+".png";
        this.preupdatedatesERequerido(data);
        this.presentCustomToast(response.message,"success");
        this.nameFile="";
        this.selectedFile = null;
        this.selectedImageUrl ="";
      },
      (error) => {
        this.presentCustomToast(error.error,"danger");
      }
    );
  }

  updateFileImageCreate(data:any,file: File,filename :string){
    this.apiService.uploadcaptureImagenERequerido(file,filename).subscribe(
      (response) => {
        data.OBSERVACIONEQUIPOREQUERIDO="N/A";
        data.IMAGENEQUIPOREQUERIDO = response.fileNameNew+".png";
        this.precreateERequerido(data);
        this.presentCustomToast(response.message,"success");
        this.nameFile="";
        this.selectedFile = null;
        this.selectedImageUrl ="";
        this.ionViewDidEnter();
      },
      (error) => {
        this.presentCustomToast(error.error,"danger");
      }
    );
  }

  cancelERequerido(){
    if(this.originData&&this.originData[0]){
      this.dataERequerido=this.originData;
      this.dataERequeridoUniq={};
    }
    if(this.selectedFile){
      this.selectedFile = null;
      this.nameFile = "";
      this.selectedImageUrl ="";
    }
    this.mostarDialogEdit=!this.mostarDialogEdit;
  }

  onCardTouchEnd(event: TouchEvent) {
    clearTimeout(this.touchTimeout);
  }

  uploadImage() {
    this.fileInputRef.nativeElement.click();
  }

  handleFileInput(event: any) {
    const file = event.target.files[0];
    this.selectedFile = file;
    this.nameFile = file.name;
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.selectedImageUrl = e.target.result;
      //this.presentCustomToast("Imagen seleccionada correctamente", "success");
    };
    reader.readAsDataURL(file);
  }

  sanitizeFileName(fileName:string) {
    const sanitizedText = fileName
      .toLowerCase()
      .replace(/\s+/g, "_")
      .replace(/[^a-z0-9_.-]/g, "");

    return sanitizedText ;
  }
  obtenerEquipoRequerido(){
    this.apiService.allEquipoRequerido().subscribe(
      (response) => {
        this.dataERequerido=response;
        setTimeout(() => {
          this.cargarImagenesBefores();
        }, 1000);

        //console.log(this.dataERequerido);
      },
      (error) => {
        this.presentCustomToast(error.error.error,"danger");
      }
    );
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
}
