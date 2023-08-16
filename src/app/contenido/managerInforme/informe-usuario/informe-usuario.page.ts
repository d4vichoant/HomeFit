import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { StatusBar, StatusBarStyle } from '@capacitor/status-bar';
import { NavController, ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { IP_ADDRESS } from '../../../constantes';
import { ApiServiceService } from 'src/app/api-service.service';
import Chart from 'chart.js/auto';

interface ChartData {
  fecha: string;
  peso: number;
}


@Component({
  selector: 'app-informe-usuario',
  templateUrl: './informe-usuario.page.html',
  styleUrls: ['./informe-usuario.page.scss'],
})
export class InformeUsuarioPage implements OnInit {
  @ViewChild('myChart', { static: true }) myChartRef!: ElementRef<HTMLCanvasElement>;
  private chart!: Chart;

  public ip_address = IP_ADDRESS;

  public loading = true;
  public userSesion!:string;
  public userSesionPerfil!:any;

  currentDate!: string;
  pesoAlturaUsuario!:any;
  pesoAlturaUsuarioorig!:any;
  pesoUsuariohistory!:any;

  dataInformeBasic!:any;

  showdialog:boolean=false;
  showdialogPeso:boolean=false;
  showdialogAltura:boolean=false;

  showdialogWebSite:boolean=false;

  chartCreated = false;
/*   data = [
    { fecha: '2023-07-19', peso: 50 },
    { fecha: '2023-07-20', peso: 61 },
    { fecha: '2023-07-21', peso: 72 },
  ]; */

  pesoMax!:number;
  pesoMin!:number;


  constructor(private navController: NavController,
    private storage: Storage,
    private apiService: ApiServiceService,
    public toastController: ToastController,) {
     }

  ngOnInit() {
    this.inicializedPage();
  }
  ionViewDidEnter() {
    this.inicializedPage();
  }

  inicializedPage(){
    this.inicio();
    this.updateCurrentDate();
    this.validateSesion();
    //document.documentElement.style.setProperty('--background-informe','url('+IP_ADDRESS+'/media/images/background_informe.jpg)');
    //this.createChart();
    this.loading=false;
  }

  validateSesion(){
    try{
      this.storage.get('sesion').then((sesion) => {
        if (sesion && JSON.parse(sesion).rolUsuario == 1) {
          this.userSesion = JSON.parse(sesion).nickname;
          this.obtenerGetPerfilCompleto(this.userSesion);
          this.apiService.protectedRequestWithToken(JSON.parse(sesion).token).subscribe(
            (response) => {
              this.StatusBar();
              this.chanceColorFooter();
              this.obtenerInformeBasic();
              this.obtenerPesoAltura();
              this.obtenerPesoHistory();
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

  StatusBar(){
    StatusBar.setOverlaysWebView({ overlay: true });
    StatusBar.setBackgroundColor({color:'transparent'});
    StatusBar.setStyle({ style: StatusBarStyle.Dark });
  }

  private handleError() {
    this.loading = false;
    this.navController.navigateForward('/error-users');
    this.storage.remove('sesion');
  }

  private chanceColorFooter(){
    document.documentElement.style.setProperty('--activate-foot10',' transparent');
    document.documentElement.style.setProperty('--activate-foot11',' #ffffffab');
    document.documentElement.style.setProperty('--activate-foot12',' transparent');
    document.documentElement.style.setProperty('--activate-foot20',' transparent');
    document.documentElement.style.setProperty('--activate-foot21',' #ffffffab');
    document.documentElement.style.setProperty('--activate-foot22',' transparent');
    document.documentElement.style.setProperty('--activate-foot30',' #ffffff');
    document.documentElement.style.setProperty('--activate-foot31',' #ffffff');
    document.documentElement.style.setProperty('--activate-foot32',' #ffffff6b');
    document.documentElement.style.setProperty('--activate-foot40',' transparent');
    document.documentElement.style.setProperty('--activate-foot41',' #ffffffab');
    document.documentElement.style.setProperty('--activate-foot42',' transparent');
    document.documentElement.style.setProperty('--activate-foot50',' transparent');
    document.documentElement.style.setProperty('--activate-foot51',' #ffffffab');
    document.documentElement.style.setProperty('--activate-foot52',' transparent');
  }

  actualizarLinea(valor: string): number {
    const valorNumber = parseFloat(valor);
    if (valorNumber < 15) {
      return 15;
    } else if (valorNumber > 40) {
      return 40;
    }
    const porcentajePosicion = ((valorNumber - 15) / (40 - 15)) * 100;
    return porcentajePosicion;
  }
  convertirAMinusculas(texto: string): string {
    return texto.toLowerCase();
  }
  obtenerPrimerNombre(nombre:string): string {
    return nombre.split(' ')[0];
  }
  updateCurrentDate() {
    const currentDate = new Date();
    const dayOfWeek = new Intl.DateTimeFormat('es-ES', { weekday: 'long' }).format(currentDate);
    const day = currentDate.getDate();
    const month = new Intl.DateTimeFormat('es-ES', { month: 'long' }).format(currentDate);
    this.currentDate = `${dayOfWeek}, ${day} de ${month}`;
  }

  createChart() {
    if (!this.pesoUsuariohistory || this.pesoUsuariohistory.length === 0) {
      this.presentCustomToast("La variable pesoUsuariohistory está vacía o es undefined.","danger");
      return;
    }

    if (this.chart) {
      this.chart.destroy();
    }

    const labels = this.pesoUsuariohistory.map((item: any) => {
      const dateParts = item.update_date.split('-');
      const day = dateParts[2];
      const month = dateParts[1];
      return `${month}/${day}`; // Retorna "DD-MM"
    });

    const pesos = this.pesoUsuariohistory.map((item: any) => item.PESOUSUARIO);
    this.chart = new Chart(this.myChartRef.nativeElement, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: "Peso",
            data: pesos,
            borderColor:  '#5b65fd',
            backgroundColor: this.createLinearGradient('#6069e8', '#0000ff00'),
            fill: true,
            pointBackgroundColor: 'transparent',
            pointBorderColor: 'rgb(82 ,93, 253)',
            pointBorderWidth: 1.5,
            pointRadius: 4,
          }
        ]
      },
      options: {
        maintainAspectRatio:false,
        aspectRatio:1.25,
        scales: {
          x: {
            grid: {
              display: false,
            },
            ticks: {
              padding: 10,
              color: '#ffffff',
            }
          },
          y: {
            beginAtZero: true,
            ticks: {
              precision: 1,
              color: '#ffffff',
            }
          }
        },
        plugins: {
          legend: {
            position: 'bottom',
            align: 'start',
            display: false,
          }
        },
      }
    });
  }

  inicio(){
    this.pesoAlturaUsuario=null||[];
    this.pesoAlturaUsuarioorig=null||[];
    this.pesoUsuariohistory=null||[];

    this.dataInformeBasic=null||[];

    this.showdialog=false;
    this.showdialogPeso=false;
    this.showdialogAltura=false;

    this.showdialogWebSite=false;

    this.chartCreated = false;

    this.pesoMax=0;
    this.pesoMin=0;
  }

  convertStringToNumber(input: string): number {
    return parseInt(input, 10) ?? 0;
  }


  createLinearGradient(colorStart: string, colorEnd: string): CanvasGradient {
    const ctx = document.createElement('canvas').getContext('2d');
    const gradient = ctx?.createLinearGradient(0, 0, 0, 200);

    if (!gradient) {
      // Si el contexto no está disponible, retornar un gradiente vacío
      return {} as CanvasGradient;
    }

    // Ajustar los colores y las posiciones en el gradiente
    gradient.addColorStop(0, colorStart);          // Color de inicio (#6069e8 en este caso)
    gradient.addColorStop(1, colorEnd);            // Color de fin (#0000ff00 en este caso)

    return gradient;
  }

  formatearFecha(fecha: string): string {
    const fechaObj = new Date(fecha);
    const year = fechaObj.getFullYear();
    const month = String(fechaObj.getMonth() + 1).padStart(2, '0');
    const day = String(fechaObj.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  updateChart(newData:ChartData[]) {
    // Aquí actualizas los datos en la gráfica
    // Por ejemplo, podrías llamar a este método cuando los datos cambien en tu aplicación

    const labels = newData.map(item => item.fecha);
    const pesos = newData.map(item => item.peso);

    // Actualizar los datos del gráfico
    this.chart.data.labels = labels;
    this.chart.data.datasets[0].data = pesos;

    // Redibujar el gráfico con los nuevos datos
    this.chart.update();
  }

  calcularIMC(datosUsuario:any): string  {
    if (!datosUsuario || datosUsuario.length === 0) {
      return '';
    }
    const altura = parseFloat(datosUsuario[0].ALTURAUSUARIO);
    const peso = parseFloat(datosUsuario[0].PESOUSUARIO);
    if (isNaN(altura) || isNaN(peso)) {
      return ''; // Datos inválidos
    }
    const imc = peso / (altura * altura);
    const imcFormateado = imc.toFixed(1);
    return imcFormateado;
  }

  clasificarIMC(imcStr: string): { clasificacion: string; colorHex: string } {
    const imc = parseFloat(imcStr);

    if (isNaN(imc)) {
      return { clasificacion: "IMC inválido", colorHex: "000000" };
    }

    let clasificacion: string;
    let colorHex: string;

    switch (true) {
      case imc < 15:
        clasificacion = "Delgadez extrema o desnutrición severa";
        colorHex = "#000000";
        break;
      case imc < 16:
        clasificacion = "Delgadez moderada";
        colorHex = "#b0d3cd";
        break;
      case imc < 18.5:
        clasificacion = "Bajo peso moderado";
        colorHex = "#4c6c93";
        break;
      case imc < 24.9:
        clasificacion = "Peso normal";
        colorHex = "#74dd78";
        break;
      case imc < 29.9:
        clasificacion = "Sobrepeso";
        colorHex = "#dce683";
        break;
      case imc < 34.9:
        clasificacion = "Obesidad Clase 1";
        colorHex = "#feb546";
        break;
      case imc < 39.9:
        clasificacion = "Obesidad Clase 2";
        colorHex = "#ea444e";
        break;
      default:
        clasificacion = "Obesidad mórbida";
        colorHex = "#000000";
        break;
    }
    return { clasificacion, colorHex };
  }

  convertirTiempoAMinutos(tiempo: string | null | undefined): number {
    if (tiempo === null || tiempo === undefined) {
      return 0;
    }
    const [horas, minutos, segundos] = tiempo.split(':').map(Number);
    return horas * 60 + minutos + Math.ceil(segundos / 60);
  }

  mostrarDialog(type:string){
    switch (type) {
      case 'altura':
        this.showdialog=true;
        this.showdialogPeso=false;
        this.showdialogAltura=true;
        break;
      case 'peso':
        this.showdialog=true;
        this.showdialogPeso=true;
        this.showdialogAltura=false;
      break;
      case 'alturapeso':
        this.showdialog=true;
        this.showdialogPeso=true;
        this.showdialogAltura=true;
      break;

      default:
        break;
    }
  }

  cancelarDialog(){
    this.showdialog=false;
    this.pesoAlturaUsuario=this.pesoAlturaUsuarioorig;
    const rawData = this.pesoAlturaUsuario;
    this.pesoAlturaUsuarioorig = rawData.map((item:any) => ({ ...item }));
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


  obtenerGetPerfilCompleto(nickname:string){
    this.apiService.connsultPerfilUsuarioCompleto(nickname).subscribe(
      (response) => {
        this.userSesionPerfil=response;
      },
      (error) => {
        this.presentCustomToast(error.error.error,"danger");
      }
    );
  }

  obtenerPesoAltura(){
    this.apiService.obtenerPesoAltura(this.userSesionPerfil[0].IDUSUARIO).subscribe(
      (response) => {
        this.pesoAlturaUsuario=response;
        const rawData = this.pesoAlturaUsuario;
        this.pesoAlturaUsuarioorig = rawData.map((item:any) => ({ ...item }));
      },
      (error) => {
        this.presentCustomToast(error.error.error,"danger");
      }
    );
  }
  actualizarPesoAltura(){
    this.apiService.actualizarPesoAltura(this.userSesionPerfil[0].IDUSUARIO,this.pesoAlturaUsuario[0]).subscribe(
      (response) => {
        this.presentCustomToast(response.message,"success");
        this.showdialog=false;
        const rawData = this.pesoAlturaUsuario;
        this.pesoAlturaUsuarioorig = rawData.map((item:any) => ({ ...item }));
        this.dataInformeBasic=[]||null;
        this.obtenerPesoHistory();
      },
      (error) => {
        this.presentCustomToast(error.error.error,"danger");
      }
    );
  }
  obtenerInformeBasic(){
    this.apiService.obtenerInformeBasic(this.userSesionPerfil[0].IDUSUARIO).subscribe(
      (response) => {
        this.dataInformeBasic=response;
        //console.log(this.dataInformeBasic);
      },
      (error) => {
        this.presentCustomToast(error.error.error,"danger");
      }
    );
  }
  async obtenerPesoHistory() {
    try {
      const response = await this.apiService.obtenerPesoHistory(this.userSesionPerfil[0].IDUSUARIO).toPromise();
      this.pesoUsuariohistory = response;

      this.pesoMax = -Infinity;
      this.pesoMin = Infinity;

      for (const item of this.pesoUsuariohistory) {
        item.update_date = this.formatearFecha(item.update_date);
        item.PESOUSUARIO = parseFloat(item.PESOUSUARIO);

        if (item.PESOUSUARIO > this.pesoMax) {
          this.pesoMax = item.PESOUSUARIO;
        }
        if (item.PESOUSUARIO < this.pesoMin) {
          this.pesoMin = item.PESOUSUARIO;
        }
      }

      if (!this.chartCreated && this.pesoUsuariohistory) {
        this.createChart();
        this.chartCreated = true; // Actualiza la bandera para indicar que el gráfico ha sido creado
      }else{
        this.ionViewDidEnter();
      }
    } catch (error:any) {
      this.presentCustomToast(error.error.error, "danger");
    }
  }
}
