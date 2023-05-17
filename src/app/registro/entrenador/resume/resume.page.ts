import { Component, OnInit } from '@angular/core';
import { AlertController, NavController, ToastController } from '@ionic/angular';

import { IP_ADDRESS } from '../../../constantes';
import { ApiServiceService } from '../../../api-service.service';
import { StatusBar } from '@capacitor/status-bar';

@Component({
  selector: 'app-resume',
  templateUrl: './resume.page.html',
  styleUrls: ['./resume.page.scss'],
})
export class ResumePage implements OnInit {
  public loading = true;
  allDatos: any = {};
  acceptTerms: boolean = false;
  selectedFile: File | null = null;
  public ip_address = IP_ADDRESS;

  public termsAccepted = false;
  termsAndConditionsText:string = "Última actualización: 16/05/2023. \n\n"+
  "\n1. Aceptación de los Términos y Condiciones"+
  "\nAl registrarte como entrenador en nuestra aplicación Home Fit Go, aceptas y te comprometes a cumplir estos términos y condiciones ('Términos y Condiciones'). Si no estás de acuerdo con alguno de los términos establecidos, no podrás registrarte ni utilizar los servicios de la Aplicación."+

  "\n2. Elegibilidad"+
  "\nPara ser un entrenador registrado en la Aplicación, debes ser una persona física mayor de 18 años o una entidad legalmente constituida y autorizada para ejercer actividades relacionadas con el entrenamiento físico. Además, debes cumplir con todos los requisitos y regulaciones legales aplicables en tu jurisdicción."+

  "\n3. Registro y Cuenta del Entrenador"+
  "\nPara registrarte como entrenador en la Aplicación, deberás proporcionar información precisa y actualizada, incluyendo tu nombre completo, dirección de correo electrónico válida, información de contacto y cualquier otra información requerida durante el proceso de registro. Te comprometes a mantener la confidencialidad de tu cuenta y serás responsable de todas las actividades realizadas a través de ella."+

  "\n4. Contenido del Entrenador"+
  "\nComo entrenador registrado, puedes proporcionar contenido relacionado con el entrenamiento físico, como rutinas de ejercicios, consejos de nutrición y programas de bienestar ('Contenido del Entrenador'). Aceptas que eres el único responsable de todo el Contenido del Entrenador que publiques en la Aplicación y garantizas que dicho contenido cumple con todas las leyes y regulaciones aplicables."+

  "\n5. Derechos de Propiedad Intelectual"+
  "\nAl publicar Contenido del Entrenador en la Aplicación, conservas todos los derechos de propiedad intelectual sobre dicho contenido. Al aceptar estos Términos y Condiciones, otorgas a la Aplicación una licencia no exclusiva, transferible, sublicenciable, libre de regalías y válida en todo el mundo para utilizar, reproducir, modificar, adaptar, distribuir y mostrar públicamente el Contenido del Entrenador con el propósito de proporcionar y promocionar la Aplicación."+

  "\n6. Tarifa de Suscripción y Pagos"+
  "\nLa Aplicación ofrece un modelo de suscripción para los usuarios que deseen acceder a los servicios de un entrenador registrado. Al utilizar los servicios de un entrenador a través de la Aplicación, los usuarios deberán pagar una tarifa de suscripción. La Aplicación retendrá el 13% de dicha tarifa como comisión por facilitar la plataforma y los servicios."+

  "\n7. Responsabilidades Financieras"+
  "\nComo entrenador registrado, aceptas que la Aplicación retendrá automáticamente el 13% de la tarifa de suscripción correspondiente a tus servicios como comisión. La Aplicación se compromete a proporcionarte un informe periódico detallado de tus ingresos y retenciones. Los pagos se realizarán según los términos y métodos acordados entre la Aplicación y los entrenadores registrados."+

  "\n8. Responsabilidades y Obligaciones del Entrenador"+
  "\nComo entrenador registrado en la Aplicación, aceptas cumplir con las siguientes responsabilidades y obligaciones:"+
  "\na) Proporcionar servicios de calidad: Te comprometes a brindar servicios de entrenamiento físico de alta calidad a los usuarios de la Aplicación. Debes cumplir con los más altos estándares profesionales y ofrecer un nivel de servicio adecuado a las expectativas de los usuarios."+

  "\nb) Mantener la confidencialidad: Reconoces y aceptas que durante la prestación de tus servicios como entrenador, podrías tener acceso a información confidencial de los usuarios. Te comprometes a mantener la confidencialidad de dicha información y a no divulgarla a terceros sin el consentimiento expreso del usuario correspondiente."+

  "\nc) Cumplir con las leyes y regulaciones: Aceptas cumplir con todas las leyes y regulaciones aplicables en relación con la prestación de tus servicios como entrenador, incluyendo, pero no limitado a, las leyes de protección de datos, propiedad intelectual, publicidad y competencia justa."+

  "\n9. Modificaciones y Terminación"+
  "\nLa Aplicación se reserva el derecho de modificar, suspender o cancelar cualquier aspecto de los servicios ofrecidos a los entrenadores registrados, en cualquier momento y sin previo aviso. Además, tanto la Aplicación como los entrenadores registrados podrán dar por terminada su relación en cualquier momento, sin incurrir en ninguna responsabilidad adicional."+

  "\n10. Responsabilidad y Exención de Responsabilidad"+
  "\nLa Aplicación no se hace responsable de las acciones, omisiones o conductas de los entrenadores registrados ni de la calidad de los servicios proporcionados. Cada entrenador es responsable de su propio comportamiento, declaraciones y servicios ofrecidos a través de la Aplicación. La Aplicación no se hace responsable de cualquier pérdida, daño o lesión resultante de la interacción entre los usuarios y los entrenadores registrados."+

  "\n11. Propiedad Intelectual de la Aplicación"+
  "\nReconoces y aceptas que la Aplicación y todo su contenido, incluyendo, pero no limitado a, logotipos, diseños, textos, gráficos, imágenes y software, están protegidos por derechos de propiedad intelectual y pertenecen a la Aplicación o a los respectivos propietarios. No se te concede ninguna licencia o derecho sobre dichos contenidos, a menos que se acuerde explícitamente en estos Términos y Condiciones."+

  "\n12. Ley Aplicable y Resolución de Conflictos"+
  "\nEstos Términos y Condiciones se regirán e interpretarán de acuerdo con las leyes del Ecuador y regulaciones establecidas por el sistema legal ecuatoriano. . Cualquier disputa o controversia que surja en relación con estos Términos y Condiciones se resolverá exclusivamente a través de medios de resolución de disputas alternativos o mediante los tribunales competentes de Ecuador y regulaciones establecidas por el sistema legal ecuatoriano."

  ;
  constructor(private navController: NavController,
    private alertController: AlertController,
    private apiService: ApiServiceService,
    public toastController: ToastController) {
    var profiledat = JSON.parse(localStorage.getItem('profilesdates')!);
    this.allDatos = profiledat;
    if (this.allDatos.rolusuario==2){
      this.allDatos.rolusuarioNombre = "Entrenador";
    }else{
      this.allDatos.rolusuarioNombre = "Entrenante";
    }
    this.allDatos.birthdayActual = this.calcularEdad(this.allDatos.birthday);
    console.log(this.allDatos);
   }
  ngOnInit() {

  }

  ionViewDidEnter() {
    StatusBar.hide();
    StatusBar.setOverlaysWebView({overlay:true});
    StatusBar.setBackgroundColor({color:'#ffffff'});
    if (JSON.parse(localStorage.getItem('profilesdates')!)!=null){
    document.documentElement.style.setProperty('--background-ip-address','url('+IP_ADDRESS+'/media/additional/backgroundadditional.jpg)');

      this.loading = false;
    }else{
      localStorage.removeItem('profilesdates');
      this.navController.navigateForward('/errorpage');
    }
  }

  go_notNow(){
    this.goHome();
    localStorage.removeItem('profilesdates');

  }
  postData() {
    var profiledat = JSON.parse(localStorage.getItem('profilesdates')!);
    const data = profiledat;
    this.apiService.saveProfileTrainer(data).subscribe(
      (response) => {
        this.presentCustomToast(response.message,"success");
        localStorage.removeItem('profilesdates');
        this.navController.navigateForward('/register-finished-trainer');
      },
      (error) => {
        console.error('Error al llamar a la API:', error);
        this.presentCustomToast(error,"danger");
      }
    );
  }
  go_Now(){
    var profiledat = JSON.parse(localStorage.getItem('profilesdates')!);
    if (!this.selectedFile) {
      profiledat.status=true;
      profiledat.activacion=false;
      localStorage.setItem('profilesdates', JSON.stringify(profiledat));
    }else{
      console.log(this.selectedFile);
      this.apiService.uploadFile(this.selectedFile,profiledat.nickname).subscribe(
        response => {
          profiledat.status=true;
          profiledat.activacion=false;
          localStorage.setItem('profilesdates', JSON.stringify(profiledat));
          //console.log(response);
        },
        error => {
          this.presentCustomToast(error,"danger");
          return;
        }
      );
    }
    this.postData();
  }

  goHome(){
    this.navController.navigateForward('/home');
  }
  public goBack(){
    this.navController.navigateForward('/tariff');
  }

  calcularEdad(fechaNacimiento: string): number {
    const fechaActual = new Date();
    const fechaNac = new Date(fechaNacimiento);

    let edad = fechaActual.getFullYear() - fechaNac.getFullYear();

    const mesActual = fechaActual.getMonth();
    const mesNac = fechaNac.getMonth();

    if (mesNac > mesActual || (mesNac === mesActual && fechaNac.getDate() > fechaActual.getDate())) {
      edad--;
    }

    return edad;
  }

  async showTermsAndConditions() {
    const alert = await this.alertController.create({
      header: 'Términos y Condiciones',
      message: this.termsAndConditionsText ,
      cssClass: 'terms-alert',
      buttons: [
        {
          text: 'Aceptar',
          handler: () => {
            this.acceptTerms=true;
            this.termsAccepted = true;
          }
        },
        {
          text: 'Cancelar',
          handler: () => {
            this.acceptTerms=false;
            this.termsAccepted = false;
          },
          role: 'cancel'
        }
      ]
    });

    await alert.present();
  }
  handleFileChange(event: any) {
    const file = event.target.files[0];
    const maxSize = 500 * 1024;
    if (file && file.size > maxSize) {
      this.presentCustomToast("Máximo permitido (500 KB)","danger");
    } else {
      this.selectedFile = file;
    }
  }
  submitForm() {

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
