import { Component, OnInit } from '@angular/core';
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
  public filter: any[]=[
    {
      name: 'Entrenador',
      iconstatus: false,
    }, {
      name: 'Usuarios',
      iconstatus: true,
    }];
  public searchTerm!:string;
  previousSearchTerm: string = '';

  showDiv = false;
  isCircle = false;
  isMoved = false;
  isTransformed = false;
  isFlipped: boolean = false;
  constructor(private navController: NavController,
    private apiService: ApiServiceService,
    public toastController: ToastController ) {
      this.ordenarfilter();
    }

  ngOnInit() {
  }
  ionViewDidEnter() {
    StatusBar.hide();
    StatusBar.setOverlaysWebView({overlay:true});
    StatusBar.setBackgroundColor({color:'#ffffff'});
    var sesion = JSON.parse(localStorage.getItem('sesion')!);
    if (sesion && sesion.rolUsuario==99){
      this.apiService.protectedRequestWithToken(sesion.token).subscribe(
        (response) => {
          this.apiService.allPeople().subscribe(
            (response) => {
              this.data=response;
              this.loading = false;
            },
            (error) => {
              this.presentCustomToast(error,"danger");
            }
          );
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

  async presentCustomToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 1400,
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

  truncarTexto(texto: string): string {
    const longitudMaxima = 59;

    if (texto.length <= longitudMaxima) {
      return texto;
    } else {
      const textoTruncado = texto.substring(0, longitudMaxima).trim();
      return textoTruncado + "...";
    }
  }

  buttonfilterhabilitate(filter:any){
    this.data = [];
    console.log(filter.iconstatus);
    if(filter.name==="Entrenador"&& !filter.iconstatus){
      this.loading = true;
      this.apiService.allTrainer().subscribe(
        (response) => {
          this.updatestausIcon(filter);
          this.data=response;
          this.loading = false;
          console.log(this.data);
        },
        (error) => {
          this.presentCustomToast(error,"danger");
        }
      );
    }else{
      if(filter.name==="Usuarios"&& !filter.iconstatus){
        this.loading = true;
          this.apiService.allPeople().subscribe(
            (response) => {
              this.updatestausIcon(filter);
              this.data=response;
              this.loading = false;
            },
            (error) => {
              this.presentCustomToast(error,"danger");
            }
          );
      }
    }
    filter.iconstatus = !filter.iconstatus;
    this.ordenarfilter();
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
  public updatestausIcon(filter:any){
    if(filter.iconstatus){
      this.filter.forEach((filterItem: any) => {
        if (filterItem !== filter){
          filterItem.iconstatus =false;
        }else{
          if(filterItem==filter){
            filterItem.iconstatus =true;
          }
        }
      });
    }
  }
  public onInputChange(event: any) {
    const currentSearchTerm = event.target.value;
    if (currentSearchTerm.length < this.previousSearchTerm.length) {
      this.clearSearch();
    }
    this.previousSearchTerm = currentSearchTerm;
    this.filterItems();
  }

  public filterItems(){
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
  }
  public clearSearch(){
    this.data=[];
    this.apiService.allPeople().subscribe(
      (response) => {
        this.loading = true;
        this.data=response;
        this.loading = false;
      },
      (error) => {
        this.presentCustomToast(error,"danger");
      }
    );
  }

  toggleDiv() {
    this.showDiv = !this.showDiv;

    const navbarOption = document.querySelector('.navbar-option');
    const largeDiv = document.querySelector('.large-div');
    if (navbarOption && largeDiv) {
    gsap.to(navbarOption, { y: this.showDiv ? -100 : 0, duration: 0.5, ease: 'power2.out' });
    gsap.to(largeDiv, { x: this.showDiv ? 0 : 100, duration: 20.5, ease: 'linear' });
    }else{
      gsap.to(navbarOption, { y: this.showDiv ? -100 : 0, duration: 0.5, ease: 'power2.out' });
      gsap.to(largeDiv, { x: this.showDiv ? 0 : 100, duration: 20.5, ease: 'linear' });
    }
  }
  toggleShape() {
    this.isCircle = !this.isCircle;

    const largeDiv = document.querySelector('.large-div');

    if (largeDiv) {
      if (this.isCircle) {
        gsap.to(largeDiv, { borderRadius: '50%', duration: 0.5 });
      } else {
        gsap.to(largeDiv, { borderRadius: '0', duration: 0.5 });
      }
    }
  }
  slideDiv() {
    const largeDiv = document.querySelector('.large-div');

    if (largeDiv) {
      if (this.isMoved) {
        gsap.to(largeDiv, { x: '0', y: '0', duration: 1 });
      } else {
        gsap.to(largeDiv, { x: '200px', y: '100px', duration: 1 });
      }

      this.isMoved = !this.isMoved;
    }
  }
  transformShape() {
    const shape = document.querySelector('.large-div');

    if (shape) {
      if (this.isTransformed) {
        gsap.to(shape, { scale: 1, skewX: 0, skewY: 0, duration: 1 });
      } else {
        gsap.to(shape, { scale: 0.5, skewX: -30, skewY: 30, duration: 1 });
      }

      this.isTransformed = !this.isTransformed;
    }
  }
  animateFlip() {
    const elemento = document.querySelector('.mi-elemento');
    if (!elemento) {
      return; // Salir de la función si elemento es null
    }

    const contenido = elemento.querySelector('.contenido') as HTMLElement;
    if (!contenido) {
      return; // Salir de la función si contenido es null
    }

    gsap.set(elemento, {
      scaleX: 0.5,
      scaleY: 0.5,
      x: '-100%',
      y: '100%',
      transformOrigin: 'bottom left'
    });

    gsap.to(elemento, {
      duration: 0.5,
      ease: 'power2.out',
      x: this.isFlipped ? '100%' : '0%',
      y: this.isFlipped ? '100%' : '0%',
      opacity: this.isFlipped ? 0 : 1,
      scaleX: this.isFlipped ? 0.5 : 1,
      scaleY: this.isFlipped ? 0.5 : 1,
      onComplete: () => {
        // Lógica que se ejecuta cuando la animación ha finalizado
        this.isFlipped = !this.isFlipped;
      },
    });

  }



}
