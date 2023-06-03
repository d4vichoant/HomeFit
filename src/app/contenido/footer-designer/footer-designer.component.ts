import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { IP_ADDRESS } from '../../constantes';

@Component({
  selector: 'app-footer-designer',
  templateUrl: './footer-designer.component.html',
  styleUrls: ['./footer-designer.component.scss'],
})
export class FooterDesignerComponent  implements OnInit {
  public ip_address = IP_ADDRESS;
  public elementoActivo!: number ;
  constructor(
    private navController: NavController,
  ) { }

  ngOnInit() {}
  go_page(name: string){
    this.navController.navigateForward('/'+name);
  }
}
