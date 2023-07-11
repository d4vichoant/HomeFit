import { Component, ElementRef, OnInit } from '@angular/core';
import { StatusBar } from '@capacitor/status-bar';
import { ApiServiceService } from '../../../api-service.service';
import { NavController, ToastController ,Animation, AnimationController } from '@ionic/angular';
import { IP_ADDRESS } from '../../../constantes';
import { AlertController } from '@ionic/angular';

import { Storage } from '@ionic/storage-angular';


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
  public origindata!:any[];
  public datagender!: any[] ;
  public dataFrecuency!: any[] ;
  public dataProfession!: any[] ;
  public dataObjPersonales!: any[] ;
  public dataRolUsers!: any[] ;
  public dataEspecialidad!: any[] ;
  public dataUniq!: any;

  bottonavailable:boolean=true;
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
  public filteredOptionsRol!: any[];
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
    public toastController: ToastController,
    public alertController: AlertController,
    private storage: Storage,
    private animationCtrl: AnimationController) {
      this.ordenarfilter();
    }

  ngOnInit() {
    this.chanceColorFooter();
    this.ValidateSesionInicio();
    this.cargarImagenesBefores();
  }
  ionViewDidEnter() {
    this.chanceColorFooter();
    this.ValidateSesionInicio();
    this.cargarImagenesBefores();
  }
  private chanceColorFooter(){
    document.documentElement.style.setProperty('--activate-foot10',' #9259f9');
    document.documentElement.style.setProperty('--activate-foot11',' #9259f9');
    document.documentElement.style.setProperty('--activate-foot20',' transparent');
    document.documentElement.style.setProperty('--activate-foot21',' #6b6a6b');
    document.documentElement.style.setProperty('--activate-foot30',' transparent');
    document.documentElement.style.setProperty('--activate-foot31',' #6b6a6b');
    document.documentElement.style.setProperty('--activate-foot40',' transparent');
    document.documentElement.style.setProperty('--activate-foot41',' #6b6a6b');
  }
  StatusBar(){
    StatusBar.hide();
    StatusBar.setOverlaysWebView({ overlay: true });
    StatusBar.setBackgroundColor({ color: '#ffffff' });
  }
  cargarImagenesBefores(){
    let imagesLoaded = 0;
    const image1 = new Image();
    const image2 = new Image();
    const image3 = new Image();
    image1.src = IP_ADDRESS + '/media/images/objetive-muscular-bk-1.png';
    image2.src = IP_ADDRESS + '/media/images/objetive-muscular-bk-2.png';
    image3.src = IP_ADDRESS + '/media/images/objetive-muscular-bk-3.png';

    const handleImageLoad = () => {
      imagesLoaded++;
      if (imagesLoaded === 3) {
        this.loading = false;
      }
    };

    image1.onload = handleImageLoad;
    image2.onload = handleImageLoad;
    image3.onload = handleImageLoad;
  }
  private ValidateSesionInicio(){
    try{
      this.storage.get('sesion').then((sesion) => {
        if (sesion && JSON.parse(sesion).rolUsuario == 99) {
          this.apiService.protectedRequestWithToken(JSON.parse(sesion).token).subscribe(
            (response) => {
              this.StatusBar();
              this.obtenerAllGender();
              this.obtenerAllPeople();
              this.obtenerAllFrecuencias();
              this.obtenerAllProfesion();
              this.obtenerObjetivosPersonales();
              this.obtenerAllRolUsuario();
              this.obtenerAllEspecialidad();
              this.inicio();
            },
            (error) => {
              this.handleError();
            }
          );
        } else {
          this.handleError();
        }
      });
    }catch (error) {
        this.handleError();
      }
  }
  private handleError() {
    this.loading = false;
    this.navController.navigateForward('/errorpage');
    this.storage.remove('sesion');
  }

  obtenerPrimerNombre(nombreCompleto: string): string {
    const nombres = nombreCompleto.split(" ");
    return nombres[0];
  }

  async checkNickname( nickname:string) {
    var f = nickname;

    this.apiService.checkNickname(f).subscribe(
      (response) => {
        const isAvailable = response.available;
        console.log(isAvailable);
        if (isAvailable) {
          this.bottonavailable=true;
          this.presentCustomToast('Usuario disponible', 'success');
        } else {
          this.bottonavailable=false;
          this.presentCustomToast('Usuario No disponible', 'danger');
        }
      },
      (error) => {
        const errorMessage = error?.error?.message || 'Error desconocido';
        this.presentCustomToast(errorMessage, 'danger');
      }
    );
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
      //this.ordenarfilter();
      if (filter.name === "Entrenador" && filter.iconstatus) {
        this.data = await this.apiService.allTrainer().toPromise();
      } else if (filter.name === "Usuarios" && filter.iconstatus) {
        this.data = await this.apiService.allPeople().toPromise();
      } else if (filter.name === "Entrenante" && filter.iconstatus) {
        this.data = await this.apiService.allEntrenantes().toPromise();
      }
     // this.ordenarfilter();
    } catch (error) {
      this.presentCustomToast(error+"", "danger");
    } finally {
      this.loading = false;
      this.filteredOptionsRol = this.filtrarArrayPorRol(this.dataRolUsers,filter.name);
    }
  }


  getBackgroundImage(idGenero: number): string {
    let imageUrl: string;

    switch (idGenero) {
      case 0:
        imageUrl = this.ip_address + '/media/images/objetive-muscular-bk-1.png';
        break;
      case 1:
        imageUrl = this.ip_address + '/media/images/objetive-muscular-bk-2.png';
        break;
      case 2:
        imageUrl = this.ip_address + '/media/images/objetive-muscular-bk-3.png';
        break;
      default:
        imageUrl = ''; // Imagen de fondo predeterminada en caso de que no haya coincidencia con las opciones anteriores
    }

    return 'url(' + imageUrl + ')';
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
  getExperienciaString(ExpNumber:string):string{
    switch (ExpNumber) {
      case '1':
        return 'Menos de 1 año';
      case '3':
        return '1-3 años';
      case '5':
        return '3-5 años';
      case '6':
        return 'Más de 5 años';
      default:
        return '0 años';
    }
  }
  public onInputChange(event: any) {
    const currentSearchTerm = event.target.value;
    if (currentSearchTerm.length < this.previousSearchTerm.length) {
      if (this.filter[0].iconstatus && this.filter[0].name==="Usuarios"){
        this.obtenerAllPeople();
      }else if(this.filter[1].iconstatus && this.filter[1].name==="Entrenador"){
        this.obtenerAllTrainers();
      }else if(this.filter[2].iconstatus && this.filter[2].name==="Entrenante"){
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
    }else if(this.filter[1].iconstatus && this.filter[1].name==="Entrenador"){
      const searchTerms = this.searchTerm.toLowerCase().trim().split(' ');
      if (searchTerms.length === 1){
        const filteredArray =  this.data.filter(item =>
        item.NOMBREPERSONA.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        item.APELLDOPERSONA.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        item.NICKNAMEPERSONA.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        item.CORREOPERSONA.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        this.calcularEdad(item.FECHANACIMIENTOPERSONA).toString().toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        this.getACTIVACIONENTRENADOR(item.ACTIVACIONENTRENADOR).toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        item.EXPERIENCIAENTRENADOR && item.EXPERIENCIAENTRENADOR.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        item.tituloESPECIALIDADENTRENADOR && item.tituloESPECIALIDADENTRENADOR.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        item.CERTIFICACIONESENTRENADOR && item.CERTIFICACIONESENTRENADOR.some((certificacion: any) =>
        certificacion.nombre.toLowerCase().includes(this.searchTerm.toLowerCase())
        )
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
    }else if(this.filter[2].iconstatus && this.filter[2].name==="Entrenante"){
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
    const rawData = this.data;
    this.origindata = rawData.map(item => ({ ...item }));

    this.loading=true;

    this.dataUniq = dataUniq;
    this.notificacionInt = parseInt( dataUniq.NOTIFICACIONUSUARIO);
    this.dataUniq.age =this.calcularEdad(this.dataUniq.FECHANACIMIENTOPERSONA);
    this.loading=false;

    if (this.filter[1].name==="Entrenador" && this.filter[1].iconstatus===true){
      if (!this.dataUniq.idespecialidadentrenador) {
        this.dataUniq.idespecialidadentrenador = []; // Inicializar como un array vacío si es null
      }else{
        dataUniq.idespecialidadentrenador = dataUniq.idespecialidadentrenador.split(',');
        dataUniq.idespecialidadentrenador = dataUniq.idespecialidadentrenador.map((element: string) => Number(element));
      }
      this.ExperienciaInt = parseInt(dataUniq.EXPERIENCIAENTRENADOR);
    }else if(this.filter[2].name==="Entrenante" && this.filter[2].iconstatus===true){
      if (!this.dataUniq.OBJETIVOSPERSONALES) {
        this.dataUniq.OBJETIVOSPERSONALES = []; // Inicializar como un array vacío si es null
      }else{
        dataUniq.OBJETIVOSPERSONALES = dataUniq.OBJETIVOSPERSONALES.split(',');
        dataUniq.OBJETIVOSPERSONALES = dataUniq.OBJETIVOSPERSONALES.map((element: string) => Number(element));
      }
    }
    this.togglePopup();
  }
  parsetoNumber(trnsf: string): number {
    return parseInt(trnsf, 10); // Utilizando la función parseInt
  }


  hidePopup() {
    this.data=this.origindata;
    this.dataUniq=null;
    this.currentTab = 1;
    this.loading=true;
    this.togglePopup();
  }

  public togglePopup(): void {
    this.overlayVisible = !this.overlayVisible;
    const animation = this.animatePopup(this.overlayVisible);
    this.loading=false;
    animation.play(); // Ejecutar la animación
  }


  private animatePopup(show: boolean): Animation {
    const animation = this.animationCtrl.create()
      .addElement(document.querySelector('.popup')!)
      .duration(300);

    if (show) {
      // Animación para mostrar el popup
      animation
        .fromTo('opacity', '0', '1')
        .fromTo('transform', 'translateY(100%)', 'translateY(0)');
    } else {
      // Animación para ocultar el popup
      animation
        .fromTo('opacity', '1', '0')
        .fromTo('transform', 'translateY(0)', 'translateY(100%)');
    }
    return animation;
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
  actualizarUsuario(dataPerson: any) {
    this.storage.get('sesion').then((sesionString) => {
      if (sesionString) {
        var profiledat = JSON.parse(sesionString);
        dataPerson.USUARIOMODIFICACIONPERSONA = profiledat.nickname;
        this.apiService.UpdatePersona(dataPerson).subscribe(
          (response) => {
            this.presentCustomToast(response.message, "success");
            this.loading = true;
            this.inicio();
            this.ngOnInit();
          },
          (error) => {
            this.presentCustomToast(error.error.error, "danger");
          }
        );
      } else {
        this.presentCustomToast('No se encontró la sesión', "danger");
      }
    });
  }


  actualizarEntrenador(dataEntre: any) {
    this.storage.get('sesion').then((sesionString) => {
      if (sesionString) {
        var profiledat = JSON.parse(sesionString);
        dataEntre.USUARIOMODIFICACIONPERSONA = profiledat.nickname;
        dataEntre.EXPERIENCIAENTRENADOR = this.ExperienciaInt;
        this.apiService.UpdateEntrenador(dataEntre).subscribe(
          (response) => {
            this.presentCustomToast(response.message, "success");
            this.loading = true;
            this.inicio();
            this.ngOnInit();
          },
          (error) => {
            this.presentCustomToast(error.error.error, "danger");
          }
        );
      } else {
        this.presentCustomToast('No se encontró la sesión', "danger");
      }
    });
  }


actualizarEntrenantes(dataPerson: any) {
  this.storage.get('sesion').then((sesionString) => {
    if (sesionString) {
      var profiledat = JSON.parse(sesionString);
      dataPerson.USUARIOMODIFICACIONPERSONA = profiledat.nickname;
      dataPerson.NOTIFICACIONUSUARIO = this.notificacionInt;
      this.apiService.UpdateEntrenantes(dataPerson).subscribe(
        (response) => {
          this.presentCustomToast(response.message, "success");
          this.loading = true;
          this.inicio();
          this.ngOnInit();
        },
        (error) => {
          this.presentCustomToast(error.error.error, "danger");
        }
      );
    } else {
      this.presentCustomToast('No se encontró la sesión', "danger");
    }
  });
}
  async confirmaractualizarUsuarioActivacion(dataUsuario :any, name:string) {
    const alert = await this.alertController.create({
      header: 'Confirmar Estado',
      message: '¿Estás seguro de activar/desactivar este '+name+'?',
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
            this.presentCustomToast('Estado del '+name+' cambiada correctamente',"success");
            this.actualizarUsuarioActivacion(dataUsuario);
          }
        }
      ]
    });

    await alert.present();
  }
  actualizarUsuarioActivacion(dataEntrenador: any) {
    this.storage.get('sesion').then((sesionString) => {
      if (sesionString) {
        var profiledat = JSON.parse(sesionString);
        dataEntrenador.USUARIOMODIFICACIONPERSONA = profiledat.nickname;
        this.loading = true;
        if (dataEntrenador.ESTADOPERSONA === 1) {
          dataEntrenador.ESTADOPERSONA = 0;
        } else {
          dataEntrenador.ESTADOPERSONA = 1;
        }
        this.apiService.UpdatePersonaEstado(dataEntrenador).subscribe(
          (response) => {
            this.presentCustomToast(response.message, "success");
            this.loading = true;
            this.inicio();
            this.ngOnInit();
          },
          (error) => {
            this.presentCustomToast(error.error.error, "danger");
          }
        );
      } else {
        this.presentCustomToast('No se encontró la sesión', "danger");
      }
    });
  }

  async confirmaractualizarEntrenadorActivacion(dataEntrenador:any) {
    const alert = await this.alertController.create({
      header: 'Confirmar Activación',
      message: '¿Estás seguro de activar/desactivar el entrenador?',
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
            this.presentCustomToast('Activacion cambiada',"success");
            this.actualizarEntrenadorActivacion(dataEntrenador);
          }
        }
      ]
    });

    await alert.present();
  }
  actualizarEntrenadorActivacion(dataEntrenador: any) {
    this.storage.get('sesion').then((sesionString) => {
      if (sesionString) {
        this.loading = true;
        if (dataEntrenador.ACTIVACIONENTRENADOR === 1) {
          dataEntrenador.ACTIVACIONENTRENADOR = 0;
        } else {
          dataEntrenador.ACTIVACIONENTRENADOR = 1;
        }
        this.apiService.UpdateEntrenadorActivacion(dataEntrenador).subscribe(
          (response) => {
            this.presentCustomToast(response.message, "success");
            this.loading = true;
            this.inicio();
            this.ngOnInit();
          },
          (error) => {
            this.presentCustomToast(error.error.error, "danger");
          }
        );
      } else {
        this.presentCustomToast('No se encontró la sesión', "danger");
      }
    });
  }
  go_page(name: string){
    this.navController.navigateForward('/'+name);
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
        this.filteredOptionsRol = this.filtrarArrayPorRol(this.dataRolUsers,this.filter.find((item) => item.iconstatus === true)?.name);
      },
      (error) => {
        this.presentCustomToast(error.error.error,"danger");
      }
    );
  }
  filtrarArrayPorRol(array: any[], rol: string): any[] {
    if (rol === 'Usuarios' || rol === 'Entrenante') {
      return array.filter((item) => item.DESCRIPCIONROLUSUARIO === 'usuario' || item.DESCRIPCIONROLUSUARIO === 'administrador');
    } else if (rol === 'Entrenador') {
      return array.filter((item) => item.DESCRIPCIONROLUSUARIO === 'entrenador' || item.DESCRIPCIONROLUSUARIO === 'administrador');
    } else {
      return [];
    }
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
    this.notificacionInt=99;
    this.ExperienciaInt=99;
    this.selectedOption=null;
    this.selectedOptionhoras='';
    this.selectedOptionCertificador='';
    this.selectedOptionNombre='';
    this.ordenarfilter();
  }
}
