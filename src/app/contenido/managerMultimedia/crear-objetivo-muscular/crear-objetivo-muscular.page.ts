import { Component, OnInit } from '@angular/core';
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
    if (currentSearchTerm.length < this.previousSearchTerm.length) {
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

  showSelect(item:any, nombre:string)
  {
    const rawData = this.dataOMuscular;
    this.originData = rawData.map(item => ({ ...item }));
    this.mostrarSelect=!this.mostrarSelect;
    this.dataOMuscylarUniq=item;
  }
  showSelectEdit(item:any, nombre:string)
  {
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
    this.dataOMuscylarUniq={};
    this.dataOMuscular=this.originData;
    this.mostrarSelect=!this.mostrarSelect;
    this.presentCustomToast('Proceso Cancelado',"danger");
  }
  cancelprocessCreate(){
    this.dataOMuscylarUniq={};
    this.mostrarSelectCreate=!this.mostrarSelectCreate;
    this.presentCustomToast('Proceso Cancelado',"danger");
  }
  cancelprocessEdit(){
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
              if(item.STATUSOBJETIVOSMUSCULARES === 1 ){
                item.OBSERVACIONOBJETIVOSMUSCULARES="N/A";
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
        this.dataOMuscylarUniq={};
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
  obtenerOMuscular(){
    this.apiService.getObjetivosMusculares().subscribe(
      (response) => {
        this.dataOMuscular=response;
      },
      (error) => {
        this.presentCustomToast(error.error.error,"danger");
      }
    );
  }
}
