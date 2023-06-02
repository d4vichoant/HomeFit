import { Component, OnInit } from '@angular/core';
import { IP_ADDRESS } from '../../../constantes';
import { ApiServiceService } from '../../../api-service.service';
import { StatusBar } from '@capacitor/status-bar';
import { Storage } from '@ionic/storage-angular';
import { AlertController, NavController, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
@Component({
  selector: 'app-crear-tipo-ejercicio',
  templateUrl: './crear-tipo-ejercicio.page.html',
  styleUrls: ['./crear-tipo-ejercicio.page.scss'],
})
export class CrearTipoEjercicioPage implements OnInit {
  public loading = true;
  public ip_address = IP_ADDRESS;

  public dataTEjercicio!: any[];
  public dataTEjercicioUniq!:any;

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
    this.obtenerTEjercicio();
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
              this.obtenerTEjercicio();
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
    const currentSearchTerm = event.target.value;
    if (currentSearchTerm.length < this.previousSearchTerm.length) {
      this.dataTEjercicio=this.selectData;
    }
    this.previousSearchTerm = currentSearchTerm;
    this.filterItems();
  }
  private filterItems() {
    if (!this.selectData) {
      const rawData = this.dataTEjercicio;
      this.selectData = rawData.map(item => ({ ...item }));
    }
    const searchTerms = this.searchTerm.toLowerCase().trim().split(' ');
    if (searchTerms.length >= 1) {
      let filteredArray: any[] = [];
        for (const term of searchTerms) {
          const filteredItems = this.selectData.filter(item =>
            item.NOMBRETIPOEJERCICIO.toLowerCase().includes(term)||
            item.DESCRIPCIONTIPOEJERCICIO.toLowerCase().includes(term)||
            this.getESTADO(item.STATUSTIPOEJERCICIO).toLowerCase().includes(term)||
            item.OBSERVACIONTIPOEJERCICIO.toLowerCase().includes(term)
          );
          filteredArray = filteredArray.concat(filteredItems);
        }
      // Eliminar duplicados del array filtrado
      this.dataTEjercicio = Array.from(new Set(filteredArray));
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
  showSelect(item:any, nombre:string)
  {
    const rawData = this.dataTEjercicio;
    this.originData = rawData.map(item => ({ ...item }));
    this.mostrarSelect=!this.mostrarSelect;
    this.dataTEjercicioUniq=item;
  }
  showSelectEdit(item:any, nombre:string)
  {
    if (item){
      const rawData = this.dataTEjercicio;
      this.originData = rawData.map(item => ({ ...item }));
      this.mostrarSelectEdit=!this.mostrarSelectEdit;
      this.dataTEjercicioUniq=item;
    }else{
      this.dataTEjercicioUniq = {};
      this.dataTEjercicioUniq.STATUSTIPOEJERCICIO="";
      this.mostrarSelectCreate=!this.mostrarSelectCreate;
    }
  }
  cancelprocess(){
    this.dataTEjercicioUniq={};
    this.dataTEjercicio=this.originData;
    this.mostrarSelect=!this.mostrarSelect;
    this.presentCustomToast('Proceso Cancelado',"danger");
  }
  cancelprocessCreate(){
    this.dataTEjercicioUniq={};
    this.mostrarSelectCreate=!this.mostrarSelectCreate;
    this.presentCustomToast('Proceso Cancelado',"danger");
  }
  cancelprocessEdit(){
    this.dataTEjercicio=this.originData;
    this.dataTEjercicioUniq={};
    this.mostrarSelectEdit=!this.mostrarSelectEdit;
    this.presentCustomToast('Proceso Cancelado',"danger");
  }
  async confirmchangeStatus(item:any, nombre:string) {
    if(item.OBSERVACIONTIPOEJERCICIO ==="N/A"  && item.STATUSTIPOEJERCICIO !== 1){
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
              if(item.STATUSTIPOEJERCICIO === 1 ){
                item.OBSERVACIONTIPOEJERCICIO="N/A";
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
        this.dataTEjercicioUniq={};
        this.ngOnInit();
      },
      (error) => {
        this.presentCustomToast(error.error.error,"danger");
      }
    );
  }
  async confirmUpdateDates(item:any, nombre:string) {
    if(item.OBSERVACIONTIPOEJERCICIO ==="N/A"  && item.STATUSTIPOEJERCICIO !== 1){
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
              if(item.STATUSTIPOEJERCICIO === 1 ){
                item.OBSERVACIONTIPOEJERCICIO="N/A";
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
    this.apiService.UpdataData(item,nombre).subscribe(
      (response) => {
        this.presentCustomToast(response.message,"success");
        this.originData=[];
        this.ngOnInit();
        this.dataTEjercicioUniq={};
      },
      (error) => {
        this.presentCustomToast(error.error.error,"danger");
      }
    );
  }
  async confirmcreatesDates(item:any, nombre:string) {
    if((item.OBSERVACIONTIPOEJERCICIO ==="" ||item.OBSERVACIONTIPOEJERCICIO ==="N/A" )&& item.STATUSTIPOEJERCICIO !== 1){
      this.presentCustomToast('Debe escribir alguna razon',"danger");
    }else{
      const alert = await this.alertController.create({
        header: 'Confirmar Estado',
        message: '¿Estás seguro que desea guardar estos datos en '+nombre+'?',
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel',
            cssClass: 'secondary',
            handler: () => {
              this.dataTEjercicioUniq={};
              this.presentCustomToast('Proceso cancelada',"danger");
            }
          }, {
            text: 'Aceptar',
            handler: () => {
              if(item.STATUSTIPOEJERCICIO === 1 ){
                item.OBSERVACIONTIPOEJERCICIO="N/A";
              }
              this.createsDates(item,nombre);
              this.mostrarSelectCreate=!this.mostrarSelectCreate;
            }
          }
        ]
      });
      await alert.present();
    }
  }
  createsDates(item:any, nombre:string)
  {
    this.apiService.CreteData(item,nombre).subscribe(
      (response) => {
        this.dataTEjercicioUniq={};
        this.presentCustomToast(response.message,"success");
        this.ngOnInit();
      },
      (error) => {
        this.presentCustomToast(error.error.error,"danger");
      }
    );
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
}
