import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { IP_ADDRESS } from '../../../constantes';
import { ApiServiceService } from '../../../api-service.service';
import { StatusBar } from '@capacitor/status-bar';
import { Storage } from '@ionic/storage-angular';
import { AlertController, NavController, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-crear-objetivo-muscular',
  templateUrl: './crear-objetivo-muscular.page.html',
  styleUrls: ['./crear-objetivo-muscular.page.scss'],
})
export class CrearObjetivoMuscularPage implements OnInit {
  public loading = true;
  public ip_address = IP_ADDRESS;

  public dataOMuscular!: any[];
  public dataOMuscylarUniq!:any;

  public selectData!: any[];
  public searchTerm:string="";
  private previousSearchTerm: string = '';

  private originData!:any[];

  public mostrarSelect:boolean=false;
  public mostrarSelectEdit:boolean=false;
  public mostrarSelectCreate:boolean=false;

  showheader:boolean=true;

  @ViewChild('fileInputRef') fileInputRef!: ElementRef;

  selectedFile: File | null = null;
  nameFile:string='';
  selectedImageUrl!:string;

  public selectImage!:string;
  public imagePortada!:string;

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
    public alertController: AlertController) { }

  ionViewDidEnter(){
     this.validateSesion();
    //this.test()
  }
  ngOnInit() {
    this.validateSesion();
    //this.test()
  }
  test(){
    this.obtenerOMuscular();
    this.loading=false;
  }
  cargarImagenesBefores(){
    const muscular = this.dataOMuscular;
    const imageUrls = [];
    if (Array.isArray(muscular)) {
      for (let i = 0; i < muscular.length; i++) {
        const nameImagen = muscular[i].IMAGENOBJETIVOSMUSCULARES;
        const imageUrl = this.ip_address+'/media/objetivomuscular/'+nameImagen;
        imageUrls.push(imageUrl);
      }
    }
    const imageUrl1 = this.ip_address+'/media/images/objetive-muscular-bk-1.png';
    imageUrls.push(imageUrl1);
    const imageUrl2 = this.ip_address+'/media/images/objetive-muscular-bk-2.png';
    imageUrls.push(imageUrl2);
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
              this.obtenerOMuscular();
              //this.loading = false;
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

  go_page(name: string){
    this.selectedImageUrl="";
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
      this.dataOMuscular=this.selectData;
    }
    this.previousSearchTerm = currentSearchTerm;
    this.filterItems();
  }

  private filterItems() {
    if (!this.selectData) {
      const rawData = this.dataOMuscular;
      this.selectData = rawData.map(item => ({ ...item }));
    }
    const searchTerms = this.searchTerm.toLowerCase().trim().split(' ');
    if (searchTerms.length >= 1) {
      let filteredArray: any[] = [];
        for (const term of searchTerms) {
          const filteredItems = this.selectData.filter(item =>
            item.NOMBREOBJETIVOSMUSCULARES.toLowerCase().includes(term)||
            item.DESCRIPCIONOBJETIVOSMUSCULARES.toLowerCase().includes(term)||
            this.getESTADO(item.STATUSOBJETIVOSMUSCULARES).toLowerCase().includes(term)||
            item.OBSERVACIONOBJETIVOSMUSCULARES.toLowerCase().includes(term)
          );
          filteredArray = filteredArray.concat(filteredItems);
        }
      // Eliminar duplicados del array filtrado
      this.dataOMuscular = Array.from(new Set(filteredArray));
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
  sanitizeFileName(fileName:string) {
    const sanitizedText = fileName
      .toLowerCase()
      .replace(/\s+/g, "_")
      .replace(/[^a-z0-9_.-]/g, "");

    return sanitizedText ;
  }
  obtenerExtensionArchivo(nombreArchivo: string): string {
    const extension = nombreArchivo.substring(nombreArchivo.lastIndexOf('.'));
    return extension;
  }

  uploadImage() {
    this.fileInputRef.nativeElement.click();
  }

  handleFileInput(event: any) {
    this.loading=true;
    const file = event.target.files[0];
    // Validar el tipo de archivo
    if (!file.type.includes('image/jpeg') && !file.type.includes('image/png')) {
      this.presentCustomToast("Imagen solo debe ser .JPG o .PNG", "danger");
      this.loading=false;
      return;
    }

    // Validar el tamaño del archivo
    if (file.size > 1024 * 1024*2) {
      // El archivo seleccionado supera el tamaño máximo de 1MB
      // Realiza alguna acción o muestra un mensaje de error
      this.presentCustomToast("Imagen no puede ser mayor de 2MB", "danger");
      this.loading=false;
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
    this.loading=false;
  }

  showSelect(item:any, nombre:string)
  {
    this.showheader=false;
    const rawData = this.dataOMuscular;
    this.originData = rawData.map(item => ({ ...item }));
    this.mostrarSelect=!this.mostrarSelect;
    this.dataOMuscylarUniq=item;
  }
  showSelectEdit(item:any, nombre:string)
  {
    this.showheader=false;
    if (item){
      const rawData = this.dataOMuscular;
      this.originData = rawData.map(item => ({ ...item }));
      this.mostrarSelectEdit=!this.mostrarSelectEdit;
      this.dataOMuscylarUniq=item;
    }else{
      this.dataOMuscylarUniq = {};
      this.dataOMuscylarUniq.STATUSOBJETIVOSMUSCULARES="";
      this.mostrarSelectCreate=!this.mostrarSelectCreate;
    }
  }
  cancelprocess(){
    this.selectedImageUrl="";
    this.showheader=true;
    this.dataOMuscylarUniq={};
    this.dataOMuscular=this.originData;
    this.mostrarSelect=!this.mostrarSelect;
    this.presentCustomToast('Proceso Cancelado',"danger");
  }
  cancelprocessCreate(){
    this.selectedImageUrl="";
    this.showheader=true;
    this.dataOMuscylarUniq={};
    this.mostrarSelectCreate=!this.mostrarSelectCreate;
    this.presentCustomToast('Proceso Cancelado',"danger");
  }
  cancelprocessEdit(){
    this.selectedImageUrl="";
    this.showheader=true;

    this.dataOMuscylarUniq={};
    this.dataOMuscular=this.originData;
    this.mostrarSelectEdit=!this.mostrarSelectEdit;
    this.presentCustomToast('Proceso Cancelado',"danger");
  }
  async confirmchangeStatus(item:any, nombre:string) {
    if(item.OBSERVACIONOBJETIVOSMUSCULARES	 ==="N/A" && item.STATUSOBJETIVOSMUSCULARES !== 1){
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
              if(item.STATUSOBJETIVOSMUSCULARES === 1 ){
                item.OBSERVACIONOBJETIVOSMUSCULARES	="N/A";
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
        this.dataOMuscylarUniq={};
        this.showheader=true;
        this.ngOnInit();
      },
      (error) => {
        this.presentCustomToast(error.error.error,"danger");
      }
    );
  }

  async confirmUpdateDates(item:any, nombre:string) {
    if(item.OBSERVACIONOBJETIVOSMUSCULARES ==="N/A"  && item.STATUSOBJETIVOSMUSCULARES !== 1){
      this.presentCustomToast('Debe escribir alguna razon',"danger");
    }else{
      const alert = await this.alertController.create({
        header: 'Confirmar Actualización',
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
              if(item.STATUSOBJETIVOSMUSCULARES === 1 ){
                item.OBSERVACIONOBJETIVOSMUSCULARES="N/A";
              }
              if(this.selectedImageUrl){
                item.IMAGENOBJETIVOSMUSCULARES=this.sanitizeFileName(item.NOMBREOBJETIVOSMUSCULARES);
              }
              if(this.selectedImageUrl){
                item.IMAGENOBJETIVOSMUSCULARES=this.sanitizeFileName(item.NOMBREOBJETIVOSMUSCULARES+this.obtenerExtensionArchivo(this.nameFile));
                this.updateFileImage(item.IMAGENOBJETIVOSMUSCULARES)
                .then((fileName) => {
                  item.IMAGENOBJETIVOSMUSCULARES="";
                  item.IMAGENOBJETIVOSMUSCULARES=fileName+this.obtenerExtensionArchivo(this.nameFile);
                  this.UpdateDates(item,nombre);
                  this.mostrarSelectEdit=!this.mostrarSelectEdit;
                })
                .catch((error) => {
                  this.presentCustomToast(error,"danger");
                });
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
  UpdateDates(item:any, nombre:string)
  {
    this.apiService.UpdataData(item,nombre).subscribe(
      (response) => {
        this.presentCustomToast(response.message,"success");
        this.originData=[];
        this.dataOMuscylarUniq={};
        this.showheader=true;
        this.selectedImageUrl="";
        this.ngOnInit();
      },
      (error) => {
        this.presentCustomToast(error.error.error,"danger");
      }
    );
  }
  async confirmcreatesDates(item:any, nombre:string) {
    if((item.OBSERVACIONOBJETIVOSMUSCULARES ==="" ||item.OBSERVACIONOBJETIVOSMUSCULARES ==="N/A" )&& item.STATUSOBJETIVOSMUSCULARES !== 1){
      this.presentCustomToast('Debe escribir alguna razon',"danger");
    }else{
      if(this.selectedImageUrl){
        const alert = await this.alertController.create({
          header: 'Confirmar Estado',
          message: '¿Estás seguro que desea guardar estos datos en '+nombre+'?',
          buttons: [
            {
              text: 'Cancelar',
              role: 'cancel',
              cssClass: 'secondary',
              handler: () => {
                this.dataOMuscylarUniq={};
                this.presentCustomToast('Proceso cancelada',"danger");
              }
            }, {
              text: 'Aceptar',
              handler: () => {
                if(item.STATUSOBJETIVOSMUSCULARES === 1 ){
                  item.OBSERVACIONOBJETIVOSMUSCULARES="N/A";
                }
                if(this.selectedImageUrl){
                  item.IMAGENOBJETIVOSMUSCULARES=this.sanitizeFileName(item.NOMBREOBJETIVOSMUSCULARES+this.obtenerExtensionArchivo(this.nameFile));
                  this.updateFileImage(item.IMAGENOBJETIVOSMUSCULARES)
                  .then((fileName) => {
                    item.IMAGENOBJETIVOSMUSCULARES=fileName+this.obtenerExtensionArchivo(this.nameFile);
                    this.createsDates(item,nombre);
                    this.mostrarSelectCreate=!this.mostrarSelectCreate;
                  })
                  .catch((error) => {
                    this.presentCustomToast(error,"danger");
                  });
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
        this.presentCustomToast("Debe Tener Portada","danger");
      }

    }
  }
  createsDates(item:any, nombre:string)
  {
    this.apiService.CreteData(item,nombre).subscribe(
      (response) => {
        this.presentCustomToast(response.message,"success");
        this.showheader=true;
        this.selectedImageUrl="";
        this.ngOnInit();
      },
      (error) => {
        this.presentCustomToast(error.error.error,"danger");
      }
    );
  }
  updateFileImage(filename: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      if (this.selectedFile) {
        this.apiService.uploadcaptureImagenOMuscular(this.selectedFile, filename).subscribe(
          (response) => {
            this.selectedFile = null;
            this.presentCustomToast(response.message, "success");
            resolve(response.fileName); // Resuelve la promesa con el valor de response.fileName
          },
          (error) => {
            this.presentCustomToast(error.error.error, "danger");
            reject(error); // Rechaza la promesa con el error
          }
        );
      } else {
        this.presentCustomToast("Portada de Rutina No seleccionada", "danger");
        reject("Portada de Rutina No seleccionada"); // Rechaza la promesa con un mensaje de error
      }
    });
  }


  async savecopy(data:any){
    const alert = await this.alertController.create({
      header: 'Confirmar Copia',
      message: '¿Estás seguro que desea realizar una Copia de este Obj. Muscular',
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
            this.CreateData(data);
          }
        }
      ]
    });
    await alert.present();
  }
  async CreateData(data:any) {
    try {
      this.loading=true;
      const response = await this.apiService.CreteData(data,'objetivosmusculares').toPromise();
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
  obtenerOMuscular(){
    this.apiService.getObjetivosMusculares().subscribe(
      (response) => {
        this.dataOMuscular=response;
        this.cargarImagenesBefores();

      },
      (error) => {
        this.presentCustomToast(error.error.error,"danger");
      }
    );
  }
}
