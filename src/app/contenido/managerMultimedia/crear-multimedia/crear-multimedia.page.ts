import { Component, OnInit } from '@angular/core';
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
export class CrearMultimediaPage implements OnInit {
  public loading = true;
  public ip_address = IP_ADDRESS;

  public dataMultimedia!: any[];
  public dataMultimediaUniq!: any;
  selectedFile: File | null = null;
  nameFile:string='';

  public selectData!: any[];
  public searchTerm:string="";
  private previousSearchTerm: string = '';

  private originData!:any[];

  public mostrarSelect:boolean=false;
  public mostrarSelectEdit:boolean=false;
  public mostrarSelectCreate:boolean=false;

  dataSelect: any[] = [
    { id: 1, nombre: 'Activo' },
    { id: 0, nombre: 'Inactivo' },
    { id: 2, nombre: 'Revisión' },
  ];

  constructor(private storage: Storage,
    private apiService: ApiServiceService,
    private navController: NavController,
    public toastController: ToastController,
    private router: Router,
    public alertController: AlertController) { }

    ionViewDidEnter(){
      //this.validateSesion();
      this.test()
    }
    ngOnInit() {
      //this.validateSesion();
      this.test()
    }
    test(){
      this.obtenerMultimedia();
      this.loading=false;
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
                this.StatusBar();
                this.obtenerMultimedia();
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

    }
    getVideoName(url: string): string {
      return url.split('.')[0];
    }
    showSelect(item:any, nombre:string)
    {
      const rawData = this.dataMultimedia;
      this.originData = rawData.map(item => ({ ...item }));
      this.mostrarSelect=!this.mostrarSelect;
      this.dataMultimediaUniq=item;
    }
    showSelectEdit(item:any, nombre:string)
    {
      if (item){
        const rawData = this.dataMultimedia;
        this.originData = rawData.map(item => ({ ...item }));
        this.mostrarSelectEdit=!this.mostrarSelectEdit;
        this.dataMultimediaUniq=item;
        const rawDat1 = this.dataMultimediaUniq.ALMACENAMIENTOMULTIMEDIA;
        this.nameFile= rawDat1;
      }else{
        this.dataMultimediaUniq = {};
        this.dataMultimediaUniq.STATUSTIPOEJERCICIO="";
        this.mostrarSelectCreate=!this.mostrarSelectCreate;
      }
    }
    cancelprocess(){
      this.dataMultimediaUniq={};
      this.dataMultimedia=this.originData;
      this.mostrarSelect=!this.mostrarSelect;
      this.presentCustomToast('Proceso Cancelado',"danger");
    }
    cancelprocessEdit(){
      this.dataMultimediaUniq={};
      this.dataMultimedia=this.originData;
      this.mostrarSelectEdit=!this.mostrarSelectEdit;
      this.presentCustomToast('Proceso Cancelado',"danger");
    }
    handleFileInput(event: any) {
      const file = event.target.files[0];
      this.selectedFile = file;
      this.nameFile=file.name;
      this.presentCustomToast("Subido archivo Correctamente","success");
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
        const alert = await this.alertController.create({
          header: 'Confirmar Estado',
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
                if(item.STATUSMULTIMEDIA === 1 ){
                  item.OBSERVACIONMULTIMEDIA="N/A";
                }
                if(this.selectedFile){
                  this.UpdateFile();
                  this.dataMultimediaUniq.ALMACENAMIENTOMULTIMEDIA = this.sanitizeFileName(this.dataMultimediaUniq.TITULOMULTIMEDIA);
                }
                this.UpdateDates(item,nombre);
                this.mostrarSelectEdit=!this.mostrarSelectEdit;
              }
            }
          ]
        });
        await alert.present();
      }
    }
    UpdateDates(item:any, nombre:string)
    {
      this.apiService.UpdataDataMultimedia(item,nombre).subscribe(
        (response) => {
          this.presentCustomToast(response.message,"success");
          this.originData=[];
          this.dataMultimediaUniq={}
          this.ngOnInit();
        },
        (error) => {
          this.presentCustomToast(error.error.error,"danger");
        }
      );
    }
    UpdateFile() {
      if (this.selectedFile) {
        this.apiService.uploadFileMp3(this.selectedFile,this.sanitizeFileName(this.dataMultimediaUniq.TITULOMULTIMEDIA)).subscribe(
          (response) => {
            this.presentCustomToast(response.message, "success");
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
      const extension = ".mp4";

      return sanitizedText + extension;
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
    obtenerMultimedia(){
      this.apiService.getMultimedia().subscribe(
        (response) => {
          this.dataMultimedia=response;
        },
        (error) => {
          this.presentCustomToast(error.error.error,"danger");
        }
      );
    }

}
