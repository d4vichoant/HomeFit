import {  Component, OnInit } from '@angular/core';
import { IP_ADDRESS } from '../../../constantes';
import { ActivatedRoute } from '@angular/router';
import { ApiServiceService } from '../../../api-service.service';
import { StatusBar } from '@capacitor/status-bar';
import { Storage } from '@ionic/storage-angular';
import { NavController, ToastController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';

import { InfiniteScrollCustomEvent } from '@ionic/angular';

import * as moment from 'moment';

@Component({
  selector: 'app-users-trainers',
  templateUrl: './users-trainers.page.html',
  styleUrls: ['./users-trainers.page.scss'],
})
export class UsersTrainersPage implements OnInit {
  public loading = true;

  public userSesion!:string;
  public userSesionPerfil!:any;

  public ip_address = IP_ADDRESS;
  variable!:any;

  public dataEspecialidad!: any[] ;

  public statuscarpeta:boolean=true;
  validatorCargarDatos:boolean=false;
  //public data!: any[];

  public datacomentariosentrenador!:any[];
  datacomentariosentrenadorparcial!:any[];
  datacomentariosentrenadorparcialImages!:any[];
  OPINIONCOMENTARIOENTRENADOR!:string;
  showmodalstars:boolean=false;
  evaluateComment:number=0;
  validatebuttonEvaluate:boolean=false;
  showovelaysusciption:boolean=false;


  pagarTotal!:string;

  dataSuscriptoresUsuarios !:any[];
  dataSuscriptoresUsuariosParcial !:any[];
  showCommentandSuscriptores:boolean=true;
  cardList: any[] = [];
  initCardList:boolean=false;
  dividendo:number=20;
  dividendoSuscriptores:number=15;

  selectedOptionCertificador?: string;
  selectedOptionNombre?: string;
  selectedOption: any;
  selectedOptionhoras?: string;
  selectedAbout?: string;

  constructor(private storage: Storage,
    private apiService: ApiServiceService,
    private navController: NavController,
    public toastController: ToastController,
    private route: ActivatedRoute,
    public alertController: AlertController,) { }

    ionViewDidEnter(){
      this.validateSesion();
      //this.test()
    }
    ngOnInit() {
      this.validateSesion();
      //this.test()
    }
    test(){
      this.loading=false;
    }
    StatusBar(){
      StatusBar.hide();
      StatusBar.setOverlaysWebView({ overlay: true });
      StatusBar.setBackgroundColor({ color: '#ffffff' });
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
    validateSesion(){
      try{
        this.storage.get('sesion').then((sesion) => {
          if (sesion && JSON.parse(sesion).rolUsuario == 2) {
            this.userSesion = JSON.parse(sesion).nickname;
            this.obtenerGetPerfilCompleto(this.userSesion);
            this.apiService.protectedRequestWithToken(JSON.parse(sesion).token).subscribe(
              (response) => {
                this.chanceColorFooter();
                this.StatusBar();
                this.obtenerAllEspecialidad();
                this.obtenerEntrenadores();
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
      this.navController.navigateForward('/error-page-users-trainers');
      this.storage.remove('sesion');
    }


    go_page(name: string){
      this.validatorCargarDatos=false;
      this.variable=null;
      this.statuscarpeta=true;
      this.OPINIONCOMENTARIOENTRENADOR='';
      this.evaluateComment=0;
      this.pagarTotal='';
      this.navController.navigateForward('/'+name);
    }
    obtenerPrimerNombre(nombre: string): string {
      if (nombre && typeof nombre === 'string') {
        const nombreArray = nombre.split(' ');
        if (nombreArray.length > 0) {
          return nombreArray[0];
        }
      }
      return ''; // Valor predeterminado en caso de que el nombre no sea válido
    }

    cargarImagenesBefores(){
      const imageUrls = [];
      const imgRutinas = this.datacomentariosentrenadorparcial;
      if (Array.isArray(imgRutinas)) {
        for (let i = 0; i < imgRutinas.length; i++) {
          const nameImagen = imgRutinas[i].IMAGEPERSONA;
          const imageUrl = this.ip_address+'/media/perfile/'+nameImagen;
          imageUrls.push(imageUrl);
        }
      }

      const imageUrl = this.ip_address+'/media/perfile/'+this.variable.IMAGEPERSONA;
      imageUrls.push(imageUrl);
      const imageUrl1 = this.ip_address+'/media/images/suscripcion.png';
      imageUrls.push(imageUrl1);
      let imagesLoaded = 0;
      const totalImages = imageUrls.length;
      const handleImageLoad = () => {
        imagesLoaded++;
        if (imagesLoaded === totalImages) {
          setTimeout(() => {
            this.loading = false;
          }, 1000);
        }
      };
      imageUrls.forEach((imageUrl) => {
        const image = new Image();
        image.onload = handleImageLoad;
        image.src = imageUrl;
      });
    }

    delay(ms: number): Promise<void> {
      return new Promise(resolve => setTimeout(resolve, ms));
    }

    async doSomethingAfterDelay(item: any) {
      if(!item.initCardList){
        item.initCardList=true;
      }
      item.changeCardView = !item.changeCardView;
      await this.delay(200);
      item.changeCard = !item.changeCard;
    }

    calcularTiempoPasado(fecha: string): string {
      if (fecha === null) {
        return '';
      }
      const fechaActual = moment();
      const fechaDada = moment(fecha);
      const diferencia = fechaActual.diff(fechaDada, 'minutes');

      if (diferencia < 60) {
        return `${diferencia} min`;
      } else if (diferencia < 1440) {
        const horas = Math.floor(diferencia / 60);
        return `${horas} horas`;
      } else {
        const dias = Math.floor(diferencia / 1440);
        return `${dias} días`;
      }
    }

    OpenDialogObjPers(name:string,dataU:any){
      this.selectedOptionNombre='';
      this.selectedOptionCertificador='';
      this.selectedOptionhoras='';
      if(name==="About"){
        this.selectedAbout=dataU.DESCRIPCIONENTRENADOR;
      }
      this.openCustomDialog(name);

    }
    openCustomDialog(name:string) {
      this.selectedOption=null;
      if(name==="EspecialidadEntrenador"){
        const customDialog = document.getElementById('custom-dialog-especialidad');
        customDialog!.style.display = 'block';
      }else if(name==="CertificacionesEntrenador"){
        const customDialog = document.getElementById('custom-dialog-certificados');
        customDialog!.style.display = 'block';
      }else if(name==="About"){
        const customDialog = document.getElementById('custom-dialog-about');
        customDialog!.style.display = 'block';
      }
    }

    AddEspecialidadEntrenador(){
      let flag=true;
      for (var i = 0; i < this.variable.tituloESPECIALIDADENTRENADOR.length; i++) {
        if(this.selectedOption === this.variable.idespecialidadentrenador[i]){
          flag=false;
        }
      }
      if (flag){
        if (!this.variable.idespecialidadentrenador) {
          this.variable.idespecialidadentrenador = []; // Inicializar como un array vacío si es null
        }
        this.variable.idespecialidadentrenador.push(this.selectedOption);

        this.addespecialidadentrenadorentrenador(this.selectedOption,"INSERT");
        this.closeCustomDialog("EspecialidadEntrenador");
      }else{
        this.presentCustomToast("Especialidad ya seleccionada","danger");
      }
    }
    async confirmarRemoveEspTrainer(data:any,name:string) {
      const alert = await this.alertController.create({
        header: 'Confirmar Eliminación',
        message: '¿Estás seguro de eliminar este '+name+'?',
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
              if(name==="Especialidad"){
                this.RemoveEspTrainer(data);
              }else{
                this.RemoveCertificaTrainer(data);
              }
            }
          }
        ]
      });

      await alert.present();
    }
    RemoveEspTrainer(data:any){
      var index = this.variable.idespecialidadentrenador.indexOf(data);
      if (index !== -1) {
        this.variable.idespecialidadentrenador.splice(index, 1);
      }
      this.addespecialidadentrenadorentrenador(data,"DELETE");
    }


    RemoveCertificaTrainer(data:any){
      var index = this.variable.CERTIFICACIONESENTRENADOR.indexOf(data);
      if (index !== -1) {
        this.variable.CERTIFICACIONESENTRENADOR.splice(index, 1);
      }
      this.addespecialidadentrenador( JSON.stringify(this.variable.CERTIFICACIONESENTRENADOR),'','','');
      //this.presentCustomToast("Certificado Eliminado Correctamente","success");
    }

    AddCertificadosEntrenador(){
      let flag=true;
      if (this.variable.CERTIFICACIONESENTRENADOR){
        for (var i = 0; i < this.variable.CERTIFICACIONESENTRENADOR.length; i++) {
          if(this.selectedOptionNombre === this.variable.CERTIFICACIONESENTRENADOR[i].nombre){
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
        if (!this.variable.CERTIFICACIONESENTRENADOR) {
          this.variable.CERTIFICACIONESENTRENADOR = []; // Inicializar como un array vacío si es null
        }
        this.variable.CERTIFICACIONESENTRENADOR.push(objetoCertificado);
        this.addespecialidadentrenador( JSON.stringify(this.variable.CERTIFICACIONESENTRENADOR),'','','');
        this.closeCustomDialog("CertificacionesEntrenador");
        }else{
          this.presentCustomToast("Llene todos los campos","danger");
        }

      }else{
        this.presentCustomToast("Certificado ya existente","danger");
      }
    }

    UpdateAbout(){
      this.variable.DESCRIPCIONENTRENADOR=this.selectedAbout;
      if(this.selectedAbout){
        this.addespecialidadentrenador('',this.selectedAbout,'','');
        this.closeCustomDialog("About");
      }
    }


    closeCustomDialog(name:string) {
    if(name==="EspecialidadEntrenador"){
        const customDialog = document.getElementById('custom-dialog-especialidad');
        customDialog!.style.display = 'none';
      }else if(name==="CertificacionesEntrenador"){
        const customDialog = document.getElementById('custom-dialog-certificados');
        customDialog!.style.display = 'none';
      }else if(name==="About"){
        const customDialog = document.getElementById('custom-dialog-about');
        customDialog!.style.display = 'none';
      }
    }

    changeStart(number:number){
      this.evaluateComment=number;
      if(!this.validatebuttonEvaluate){
        this.validatebuttonEvaluate=true;
      }
    }

    llenarMasDatos(){
      if(this.showCommentandSuscriptores){
      const endIndex = Math.ceil(this.datacomentariosentrenadorparcial.length / this.dividendo);
      const start = endIndex * this.dividendo;
      const end = endIndex * this.dividendo + this.dividendo;
      const additionalData = this.datacomentariosentrenador.slice(start, end > this.datacomentariosentrenador.length ? this.datacomentariosentrenador.length : end);
      this.datacomentariosentrenadorparcial.push(...additionalData);
      }else{
        const endIndex = Math.ceil(this.dataSuscriptoresUsuariosParcial.length / this.dividendoSuscriptores);
        const start = endIndex * this.dividendoSuscriptores;
        const end = endIndex * this.dividendoSuscriptores + this.dividendoSuscriptores;
        const additionalData = this.dataSuscriptoresUsuarios.slice(start, end > this.dataSuscriptoresUsuarios.length ? this.dataSuscriptoresUsuarios.length : end);
        this.dataSuscriptoresUsuariosParcial.push(...additionalData);
      }
    }

    onIonInfinite(ev:any) {
      this.llenarMasDatos();
      setTimeout(() => {
        (ev as InfiniteScrollCustomEvent).target.complete();
      }, 3000);
    }

    truncateText(text: string): string {
      const wordArray = text.trim().split(' ');
      const truncatedArray = wordArray.slice(0, 10);
      return truncatedArray.join(' ');
    }

    getRemainingText(text: string): string {
      const wordArray = text.trim().split(' ');
      const remainingArray = wordArray.slice(10);
      return remainingArray.join(' ');
    }

    contarpalabras(texto: string): number {
      if (texto === null) {
        return -1;
      }

      const palabras = texto.trim().split(' ');
      return palabras.length;
    }
    finddataEspecialidad(idEspecialidad:Number):any{
      return this.dataEspecialidad.find(item=> item.idespecialidadentrenador  === idEspecialidad);
    }
    formatNumber() {
      this.variable.TARIFASENTRENADOR = parseFloat(this.variable.TARIFASENTRENADOR.toFixed(2));
      this.addespecialidadentrenador('','',this.variable.TARIFASENTRENADOR ,'');
    }
    onExperienciaChange(){
      this.addespecialidadentrenador('','','',this.variable.EXPERIENCIAENTRENADOR);
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

    obtenercomentariosentrenador(){
      this.apiService.getcomentariosentrenador( this.variable.IDENTRENADOR).subscribe(
        (response) => {
          this.datacomentariosentrenador=response;
          this.datacomentariosentrenadorparcial=this.datacomentariosentrenador.slice(0, this.dividendo);
          this.datacomentariosentrenadorparcialImages=this.datacomentariosentrenador;
          this.datacomentariosentrenadorparcialImages = Object.values(this.datacomentariosentrenadorparcial.reduce((uniqueData: any, currentItem: any) => {
            if (!uniqueData[currentItem.IDUSUARIO]) {
              uniqueData[currentItem.IDUSUARIO] = currentItem;
            }
            return uniqueData;
          }, {}));

          this.obtenerSuscriptores();
        },
        (error) => {
          this.presentCustomToast(error.error,"danger");
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
  addespecialidadentrenadorentrenador(idespecialidadentrenador:Number,type:string){
    const data={
      idEntrenador:this.variable.IDENTRENADOR,
      idEspecialidad:idespecialidadentrenador,
      type:type
    }
    this.apiService.addespecialidadentrenadorentrenador(data).subscribe(
      (response) => {
        this.presentCustomToast(response.message,"success");
      },
      (error) => {
        this.presentCustomToast(error.error.error,"danger");
      }
    );
  }

  addespecialidadentrenador(certificionentrenador:string,aboutEntrenador:string,TARIFASENTRENADOR:string,EXPERIENCIAENTRENADOR:String){
    let data: any = null;
    if(certificionentrenador!==''){
      data={
      idEntrenador:this.variable.IDENTRENADOR,
      certificionentrenador:certificionentrenador
    }
    }else if (aboutEntrenador!==''){
      data={
        idEntrenador:this.variable.IDENTRENADOR,
        acercaEntrenador:aboutEntrenador
      }
    }else if(TARIFASENTRENADOR!==''){
      data={
        idEntrenador:this.variable.IDENTRENADOR,
        TARIFASENTRENADOR:parseFloat(TARIFASENTRENADOR)
      }
    }else if(EXPERIENCIAENTRENADOR!==''){
      data={
        idEntrenador:this.variable.IDENTRENADOR,
        EXPERIENCIAENTRENADOR:EXPERIENCIAENTRENADOR
      }
    }
    this.apiService.addespecialidadentrenador(data).subscribe(
      (response) => {
        this.presentCustomToast(response.message,"success");
      },
      (error) => {
        this.presentCustomToast(error.error.error,"danger");
      }
    );
  }

  obtenerSuscriptores(){
    this.apiService.obtenerContratoUsuarioPorEntrenador(this.variable.IDENTRENADOR).subscribe(
      (response) => {
        this.dataSuscriptoresUsuarios = response.map((item:any) => {
          if(item.FECHADECONTRATACION){
            item.FECHADECONTRATACION=new Date(item.FECHADECONTRATACION).toISOString().split('T')[0];
          }
          if(item.FECHAFINAL){
            item.FECHAFINAL=new Date(item.FECHAFINAL).toISOString().split('T')[0];
          }
          if (item.DESCRIPCIONOBJETIVOSPERSONALES) {
            item.DESCRIPCIONOBJETIVOSPERSONALES = item.DESCRIPCIONOBJETIVOSPERSONALES.split(",");
          }
          if (item.IDOBJETIVOSPERSONALES) {
            item.IDOBJETIVOSPERSONALES = item.IDOBJETIVOSPERSONALES.split(",").map(Number);
          }
          return item;
        });
        this.dataSuscriptoresUsuariosParcial=this.dataSuscriptoresUsuarios.slice(0, this.dividendoSuscriptores);
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
    obtenerEntrenadores(){
      this.apiService.allTrainerBasicEjercicioRutina().subscribe(
        (response) => {
          const dataEntrenadores=response;
          this.variable = dataEntrenadores.find((item: any) => item.IDPERSONA === this.userSesionPerfil[0].IDPERSONA);
          if(this.variable.tituloESPECIALIDADENTRENADOR)
          {
            const tituloESPECIALIDADENTRENADORarray=this.variable.tituloESPECIALIDADENTRENADOR.split(",");
            this.variable.tituloESPECIALIDADENTRENADOR=tituloESPECIALIDADENTRENADORarray;
          }
          if(this.variable.CERTIFICACIONESENTRENADOR){
            const dataArray: any[] = JSON.parse(this.variable.CERTIFICACIONESENTRENADOR);
            this.variable.CERTIFICACIONESENTRENADOR=dataArray;
          }
          if(this.variable.idespecialidadentrenador){
            const tidespecialidadentrenador=this.variable.idespecialidadentrenador.split(",").map(Number);
            this.variable.idespecialidadentrenador=tidespecialidadentrenador;
          }
          if (this.variable.EXPERIENCIAENTRENADOR){
            this.variable.EXPERIENCIAENTRENADOR=parseInt(this.variable.EXPERIENCIAENTRENADOR);
          }
          console.log(this.variable);
          this.obtenercomentariosentrenador();
        },
        (error) => {
          this.presentCustomToast(error.error.error,"danger");
        }
      );
    }

}
