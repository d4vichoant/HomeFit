import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IP_ADDRESS } from '../../../constantes';
import { NavController } from '@ionic/angular';
import { StatusBar } from '@capacitor/status-bar';
import { Storage } from '@ionic/storage-angular';
import { ApiServiceService } from '../../../api-service.service';

@Component({
  selector: 'app-crear-ejercicio',
  templateUrl: './crear-ejercicio.page.html',
  styleUrls: ['./crear-ejercicio.page.scss'],
})
export class CrearEjercicioPage implements OnInit {
  public loading = true;
  public ip_address = IP_ADDRESS;
  variable: any;
  constructor(private route: ActivatedRoute,
    private navController: NavController,
    private storage: Storage,
    private apiService: ApiServiceService) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.variable = params['variable'];
      console.log(this.variable); // Aquí deberías ver el valor pasado
    });
    this.StatusBar();
    this.loading = false;
    //this.validateSesion();

  }
  ionViewDidEnter() {
    this.StatusBar();
    this.loading = false;
    //this.validateSesion();
  }

  go_page(name: string){
    this.navController.navigateForward('/'+name);
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

}
