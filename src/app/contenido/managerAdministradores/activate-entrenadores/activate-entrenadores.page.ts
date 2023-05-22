import { Component, ElementRef, OnInit } from '@angular/core';
import { StatusBar } from '@capacitor/status-bar';
import { ApiServiceService } from '../../../api-service.service';
import { NavController, ToastController } from '@ionic/angular';
import { gsap } from 'gsap';
import { IP_ADDRESS } from '../../../constantes';

@Component({
  selector: 'app-activate-entrenadores',
  templateUrl: './activate-entrenadores.page.html',
  styleUrls: ['./activate-entrenadores.page.scss'],
})
export class ActivateEntrenadoresPage implements OnInit {
  public loading = true;
  public ip_address = IP_ADDRESS;
  public status = false;
  public data!: any[] ;
  public datagender!: any[] ;
  public dataFrecuency!: any[] ;
  public dataProfession!: any[] ;
  public dataObjPersonales!: any[] ;
  public dataRolUsers!: any[] ;
  public dataEspecialidad!: any[] ;
  public dataUniq!: any;
  public filter: any[]=[
    {
      name: 'Entrenador',
      iconstatus: false,
    }, {
      name: 'Usuarios',
      iconstatus: true,
    },{
      name: 'Entrenante',
      iconstatus: false,
    }];
  public searchTerm!:string;
  previousSearchTerm: string = '';
  overlayVisible: boolean = false;
  currentTab = 1;
  public notificacionInt!:number;
  public ExperienciaInt!:number;
  selectedOption: any;
  selectedOptionhoras?: string;
  selectedOptionCertificador?: string;
  selectedOptionNombre?: string;
  constructor(private navController: NavController,
    private apiService: ApiServiceService,
    public toastController: ToastController,) {
      this.ordenarfilter();
    }

  ngOnInit() {
    StatusBar.hide();
    StatusBar.setOverlaysWebView({overlay:true});
    StatusBar.setBackgroundColor({color:'#ffffff'});
    var sesion = JSON.parse(localStorage.getItem('sesion')!);
    if (sesion && sesion.rolUsuario==99){
      this.apiService.protectedRequestWithToken(sesion.token).subscribe(
        (response) => {
          this.obtenerAllGender();
          this.obtenerAllPeople();
          this.obtenerAllFrecuencias();
          this.obtenerAllProfesion();
          this.obtenerObjetivosPersonales();
          this.obtenerAllRolUsuario();
          this.obtenerAllEspecialidad();
          this.loading=false;
        },
        (error) => {
          this.loading = false;
          this.navController.navigateForward('/errorpage');
          localStorage.removeItem('sesion');
        }
      );
    }else{
      this.loading = false;
      localStorage.removeItem('sesion');
      this.navController.navigateForward('/errorpage');
    }
  }
  ionViewDidEnter() {
    StatusBar.hide();
    StatusBar.setOverlaysWebView({overlay:true});
    StatusBar.setBackgroundColor({color:'#ffffff'});
  }

  obtenerPrimerNombre(nombreCompleto: string): string {
    const nombres = nombreCompleto.split(" ");
    return nombres[0];
  }

  calcularEdad(fechaNacimiento: string): number {
    const fechaActual = new Date();
    const fechaNac = new Date(fechaNacimiento);
    let edad = fechaActual.getFullYear() - fechaNac.getFullYear();

    const mesActual = fechaActual.getMonth() + 1;
    const mesNac = fechaNac.getMonth() + 1;

    if (mesNac > mesActual || (mesNac === mesActual && fechaNac.getDate() > fechaActual.getDate())) {
      edad--;
    }

    return edad;
  }


  async buttonfilterhabilitate(filter: any) {
    try {
      this.loading = true;
      this.data = [];
      this.searchTerm="";

      if (filter.iconstatus) {
        // Si el elemento seleccionado ya está activo, establecer todos los iconstatus en false
        for (const fil of this.filter) {
          fil.iconstatus = false;
        }
      } else {
        // Si el elemento seleccionado no está activo, establecer todos los iconstatus en false excepto el seleccionado
        for (const fil of this.filter) {
          fil.iconstatus = (fil === filter);
        }
      }
      this.ordenarfilter();
      if (filter.name === "Entrenador" && filter.iconstatus) {
        this.data = await this.apiService.allTrainer().toPromise();
      } else if (filter.name === "Usuarios" && filter.iconstatus) {
        this.data = await this.apiService.allPeople().toPromise();
      } else if (filter.name === "Entrenante" && filter.iconstatus) {
        this.data = await this.apiService.allEntrenantes().toPromise();
      }
      this.ordenarfilter();
    } catch (error) {
      this.presentCustomToast(error+"", "danger");
    } finally {
      this.loading = false;
    }
  }



  ordenarfilter(){
    this.filter.sort((a, b) => {
      // Si iconstatus es true, colocar el elemento antes en la lista
      if (a.iconstatus && !b.iconstatus) {
        return -1;
      }
      // Si iconstatus es false, colocar el elemento después en la lista
      if (!a.iconstatus && b.iconstatus) {
        return 1;
      }
      // Si ambos tienen el mismo valor de iconstatus, mantener el orden actual
      return 0;
    });
  }
  public getRoleName(role: number): string {
    switch (role) {
      case 1:
        return 'Entrenante';
      case 2:
        return 'Entrenador';
      case 99:
        return 'Administrador';
      default:
        return '';
    }
  }
  public getESTADOPERSONA(status:number):string{
    switch (status) {
      case 1:
        return 'Activo';
      case 0:
        return 'Inactivo';
      default:
        return '';
    }
  }
  public getACTIVACIONENTRENADOR(status:number):string{
    switch (status) {
      case 1:
        return 'Activo';
      case 0:
        return 'Revisión';
      default:
        return '';
    }
  }
  public onInputChange(event: any) {
    const currentSearchTerm = event.target.value;
    if (currentSearchTerm.length < this.previousSearchTerm.length) {
      if (this.filter[0].iconstatus && this.filter[0].name==="Usuarios"){
        this.obtenerAllPeople();
      }else if(this.filter[0].iconstatus && this.filter[0].name==="Entrenador"){
        this.obtenerAllTrainers();
      }else if(this.filter[0].iconstatus && this.filter[0].name==="Entrenante"){
        this.obtenerAllEntrenantes();
      }
    }
    this.previousSearchTerm = currentSearchTerm;
    this.filterItems();
  }

  public filterItems(){
    if (this.filter[0].iconstatus && this.filter[0].name==="Usuarios"){
      const searchTerms = this.searchTerm.toLowerCase().trim().split(' ');
      if (searchTerms.length === 1){
        const filteredArray =  this.data.filter(item =>
        item.NOMBREPERSONA.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        item.APELLDOPERSONA.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        item.NICKNAMEPERSONA.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        item.CORREOPERSONA.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        this.calcularEdad(item.FECHANACIMIENTOPERSONA).toString().toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        this.getRoleName(item.IDROLUSUARIO).toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        this.getESTADOPERSONA(item.ESTADOPERSONA).toLowerCase().includes(this.searchTerm.toLowerCase())
      );
       this.data =filteredArray;
      }else if (searchTerms.length === 2) {
        const searchTerm1 = searchTerms[0];
        const searchTerm2 = searchTerms[1];
        const filteredArray =  this.data.filter(item =>
          item.NOMBREPERSONA.toLowerCase().includes(searchTerm1.toLowerCase()) &&
          item.APELLDOPERSONA.toLowerCase().includes(searchTerm2.toLowerCase())
        );
        this.data =filteredArray;
      }
    }else if(this.filter[0].iconstatus && this.filter[0].name==="Entrenador"){
      const searchTerms = this.searchTerm.toLowerCase().trim().split(' ');
      if (searchTerms.length === 1){
        const filteredArray =  this.data.filter(item =>
        item.NOMBREPERSONA.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        item.APELLDOPERSONA.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        item.NICKNAMEPERSONA.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        item.CORREOPERSONA.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        this.calcularEdad(item.FECHANACIMIENTOPERSONA).toString().toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        this.getACTIVACIONENTRENADOR(item.ACTIVACIONENTRENADOR).toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        item.EXPERIENCIAENTRENADOR.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        item.tituloESPECIALIDADENTRENADOR.toLowerCase().includes(this.searchTerm.toLowerCase())
        );
       this.data =filteredArray;
      }else if (searchTerms.length === 2) {
        const searchTerm1 = searchTerms[0];
        const searchTerm2 = searchTerms[1];
        const filteredArray =  this.data.filter(item =>
          item.NOMBREPERSONA.toLowerCase().includes(searchTerm1.toLowerCase()) &&
          item.APELLDOPERSONA.toLowerCase().includes(searchTerm2.toLowerCase())
        );
        this.data =filteredArray;
      }
    }else if(this.filter[0].iconstatus && this.filter[0].name==="Entrenante"){
      const searchTerms = this.searchTerm.toLowerCase().trim().split(' ');
      if (searchTerms.length === 1){
        const filteredArray =  this.data.filter(item =>
        item.NOMBREPERSONA.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        item.APELLDOPERSONA.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        item.NICKNAMEPERSONA.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        item.CORREOPERSONA.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        this.calcularEdad(item.FECHANACIMIENTOPERSONA).toString().toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        item.DESCRIPCIONPROFESION.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        this.getESTADOPERSONA(item.ESTADOPERSONA).toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        item.TituloFrecuenciaEjercicio.toLowerCase().includes(this.searchTerm.toLowerCase())
        );
       this.data =filteredArray;
      }else if (searchTerms.length === 2) {
        const searchTerm1 = searchTerms[0];
        const searchTerm2 = searchTerms[1];
        const filteredArray =  this.data.filter(item =>
          item.NOMBREPERSONA.toLowerCase().includes(searchTerm1.toLowerCase()) &&
          item.APELLDOPERSONA.toLowerCase().includes(searchTerm2.toLowerCase())
        );
        this.data =filteredArray;
      }
    }

  }

  showPopup(dataUniq:any ) {
    const overlay = document.getElementById('overlay');
    const popup = document.querySelector('.popup');

    gsap.to(overlay, { duration: 0.8, opacity: 1 });
    gsap.to(popup, { duration: 0.5, y: '0%' });
    this.loading=true;
    this.overlayVisible = true;

    this.dataUniq = dataUniq;
    this.notificacionInt = parseInt( dataUniq.NOTIFICACIONUSUARIO);
    this.dataUniq.age =this.calcularEdad(this.dataUniq.FECHANACIMIENTOPERSONA);
    this.loading=false;

    if (this.filter[0].name==="Entrenador"){
      this.ExperienciaInt = parseInt(dataUniq.EXPERIENCIAENTRENADOR);
      dataUniq.idespecialidadentrenador = dataUniq.idespecialidadentrenador.split(',');
      dataUniq.idespecialidadentrenador = dataUniq.idespecialidadentrenador.map((element: string) => Number(element));
      dataUniq.CERTIFICACIONESENTRENADOR = JSON.parse(dataUniq.CERTIFICACIONESENTRENADOR);
    }else if(this.filter[0].name==="Entrenante"){
      dataUniq.OBJETIVOSPERSONALES = dataUniq.OBJETIVOSPERSONALES.split(',');
      dataUniq.OBJETIVOSPERSONALES = dataUniq.OBJETIVOSPERSONALES.map((element: string) => Number(element));
    }
  }
  parsetoNumber(trnsf: string): number {
    return parseInt(trnsf, 10); // Utilizando la función parseInt
  }


  hidePopup() {
    this.dataUniq=null;
    const overlay = document.getElementById('overlay');
    const popup = document.querySelector('.popup');
    this.currentTab = 1;
    gsap.to(overlay, { duration: 0.5, opacity: 0, onComplete: () => {
      this.overlayVisible = false;
    }});

    gsap.to(popup, { duration: 0.5, y: '100%' });
  }

  showTab(tabNumber: number) {
    this.presentCustomToast("Recuerde Guardar en cada Pestaña","warning");
    this.currentTab = tabNumber;
  }
  isTabSelected(tabNumber: number): boolean {
    return this.currentTab === tabNumber;
  }
  OpenDialogObjPers(name:string,dataU:any){
    this.dataUniq=dataU;
    this.selectedOptionNombre='';
    this.selectedOptionCertificador='';
    this.selectedOptionhoras='';
    this.openCustomDialog(name);
  }
  RemoveObjPers(data:any){
    var index = this.dataUniq.OBJETIVOSPERSONALES.indexOf(data);
    if (index !== -1) {
      this.dataUniq.OBJETIVOSPERSONALES.splice(index, 1);
    }
    this.presentCustomToast("Objetivo Eliminado Correctamente","success");
  }
  RemoveEspTrainer(data:any){
    var index = this.dataUniq.idespecialidadentrenador.indexOf(data);
    if (index !== -1) {
      this.dataUniq.idespecialidadentrenador.splice(index, 1);
    }
    this.presentCustomToast("Especialidad Eliminado Correctamente","success");
  }
  RemoveCertificaTrainer(data:any){
    var index = this.dataUniq.CERTIFICACIONESENTRENADOR.indexOf(data);
    if (index !== -1) {
      this.dataUniq.CERTIFICACIONESENTRENADOR.splice(index, 1);
    }
    this.presentCustomToast("Certificado Eliminado Correctamente","success");
  }
  AddObjetivePersonal(){
    let flag=true;
    for (var i = 0; i < this.dataUniq.OBJETIVOSPERSONALES.length; i++) {
      if(this.selectedOption === this.dataUniq.OBJETIVOSPERSONALES[i]){
        flag=false;
      }
    }
    if(flag){
      this.presentCustomToast("Objetivo Agregado Correctamente","success");
      this.dataUniq.OBJETIVOSPERSONALES.push(this.selectedOption);
      this.closeCustomDialog("ObjetivePersonal");
    }else{
      this.presentCustomToast("Objetivo ya seleccionado","danger");

    }
  }
  AddEspecialidadEntrenador(){
    let flag=true;
    for (var i = 0; i < this.dataUniq.idespecialidadentrenador.length; i++) {
      if(this.selectedOption === this.dataUniq.idespecialidadentrenador[i]){
        flag=false;
      }
    }
    if (flag){
      if (!this.dataUniq.idespecialidadentrenador) {
        this.dataUniq.idespecialidadentrenador = []; // Inicializar como un array vacío si es null
      }
      this.dataUniq.idespecialidadentrenador.push(this.selectedOption);
      this.presentCustomToast("Especialidad Agregada Correctamente","success");
      this.closeCustomDialog("EspecialidadEntrenador");
    }else{
      this.presentCustomToast("Especialidad ya seleccionada","danger");
    }

  }
  AddCertificadosEntrenador(){
    let flag=true;
    if (this.dataUniq.CERTIFICACIONESENTRENADOR){
      for (var i = 0; i < this.dataUniq.CERTIFICACIONESENTRENADOR.length; i++) {
        if(this.selectedOptionNombre === this.dataUniq.CERTIFICACIONESENTRENADOR[i].nombre){
          flag=false;
        }
      }
    }

    if (flag ){
      if(this.selectedOptionNombre && this.selectedOptionCertificador && this.selectedOptionhoras){
      const objetoCertificado= {
        nombre: this.selectedOptionNombre,
        certificador: this.selectedOptionCertificador,
        horas: this.selectedOptionhoras
      };
      if (!this.dataUniq.CERTIFICACIONESENTRENADOR) {
        this.dataUniq.CERTIFICACIONESENTRENADOR = []; // Inicializar como un array vacío si es null
      }
      this.dataUniq.CERTIFICACIONESENTRENADOR.push(objetoCertificado);
      this.presentCustomToast("Especialidad Agregada Correctamente","success");
      this.closeCustomDialog("CertificacionesEntrenador");
      }else{
        this.presentCustomToast("Llene todos los campos","danger");
      }

    }else{
      this.presentCustomToast("Certificado ya existente","danger");
    }
  }

  openCustomDialog(name:string) {
    this.selectedOption=null;
    if(name==="ObjetivePersonal"){
      const customDialog = document.getElementById('custom-dialog');
      customDialog!.style.display = 'block';
    }else if(name==="EspecialidadEntrenador"){
      const customDialog = document.getElementById('custom-dialog-especialidad');
      customDialog!.style.display = 'block';
    }else if(name==="CertificacionesEntrenador"){
      const customDialog = document.getElementById('custom-dialog-certificados');
      customDialog!.style.display = 'block';
    }
  }

  closeCustomDialog(name:string) {
    if(name==="ObjetivePersonal"){
      const customDialog = document.getElementById('custom-dialog');
      customDialog!.style.display = 'none';
    }else if(name==="EspecialidadEntrenador"){
      const customDialog = document.getElementById('custom-dialog-especialidad');
      customDialog!.style.display = 'none';
    }else if(name==="CertificacionesEntrenador"){
      const customDialog = document.getElementById('custom-dialog-certificados');
      customDialog!.style.display = 'none';
    }
  }
  actualizarUsuario(dataPerson:any){
    var profiledat = JSON.parse(localStorage.getItem('sesion')!);
    dataPerson.USUARIOMODIFICACIONPERSONA=profiledat.nickname
    this.apiService.UpdatePersona(dataPerson).subscribe(
      (response) => {
        this.presentCustomToast(response.message,"success");
        this.loading=true;
        this.inicio();
        this.ngOnInit();
      },
      (error) => {
        this.presentCustomToast(error.error.error,"danger");
      }
    );
  }
  actualizarEntrenantes(dataPerson:any){
    console.log(dataPerson);
    var profiledat = JSON.parse(localStorage.getItem('sesion')!);
    dataPerson.USUARIOMODIFICACIONPERSONA=profiledat.nickname;
    dataPerson.NOTIFICACIONUSUARIO = this.notificacionInt;
    this.apiService.UpdateEntrenantes(dataPerson).subscribe(
      (response) => {
        this.presentCustomToast(response.message,"success");
        this.loading=true;
        this.inicio();
        this.ngOnInit();
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
  obtenerAllPeople(){
    this.apiService.allPeople().subscribe(
      (response) => {
        this.data=response;
      },
      (error) => {
        this.presentCustomToast(error.error.error,"danger");
      }
    );
  }
  obtenerAllGender(){
    this.apiService.allGender().subscribe(
      (response) => {
        this.datagender=response;
      },
      (error) => {
        this.presentCustomToast(error.error.error,"danger");
      }
    );
  }
  obtenerAllTrainers(){
    this.apiService.allTrainer().subscribe(
      (response) => {
        this.data=response;
      },
      (error) => {
        this.presentCustomToast(error.error.error,"danger");
      }
    );
  }
  obtenerAllEntrenantes(){
    this.apiService.allEntrenantes().subscribe(
      (response) => {
        this.data=response;
      },
      (error) => {
        this.presentCustomToast(error.error.error,"danger");
      }
    );
  }
  obtenerAllFrecuencias(){
    this.apiService.allfrecuenciaejercicio().subscribe(
      (response) => {
        this.dataFrecuency=response;
      },
      (error) => {
        this.presentCustomToast(error.error.error,"danger");
      }
    );
  }
  obtenerAllProfesion(){
    this.apiService.allprofesion().subscribe(
      (response) => {
        this.dataProfession=response;
      },
      (error) => {
        this.presentCustomToast(error.error.error,"danger");
      }
    );
  }
  obtenerObjetivosPersonales(){
    this.apiService.allObjetivosPersonales().subscribe(
      (response) => {
        this.dataObjPersonales=response;
      },
      (error) => {
        this.presentCustomToast(error.error.error,"danger");
      }
    );
  }
  obtenerAllRolUsuario(){
    this.apiService.allObtenerRolUsers().subscribe(
      (response) => {
        this.dataRolUsers=response;
      },
      (error) => {
        this.presentCustomToast(error.error.error,"danger");
      }
    );
  }
  obtenerAllEspecialidad(){
    this.apiService.allEspecialidadentrenador().subscribe(
      (response) => {
        this.dataEspecialidad=response;
      },
      (error) => {
        this.presentCustomToast(error.error.error,"danger");
      }
    );
  }
  inicio(){
    this.status = false;
    this.data = [];
    this.datagender=[];
    this.dataFrecuency=[] ;
    this.dataProfession=[] ;
    this.dataObjPersonales=[]  ;
    this.dataRolUsers=[]  ;
    this.dataEspecialidad=[] ;
    this.dataUniq=[];
    this.filter=[
    {
      name: 'Entrenador',
      iconstatus: false,
    }, {
      name: 'Usuarios',
      iconstatus: true,
    },{
      name: 'Entrenante',
      iconstatus: false,
    }];
    this.searchTerm='';
    this.previousSearchTerm = '';
    this.overlayVisible = false;
    this.currentTab = 1;
    this.notificacionInt=99;
    this.ExperienciaInt=99;
    this.selectedOption=null;
    this.selectedOptionhoras='';
    this.selectedOptionCertificador='';
    this.selectedOptionNombre='';
    this.ordenarfilter();
  }
}
