import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { IP_ADDRESS } from '../../constantes';

@Component({
  selector: 'app-toolbar-designer-white',
  templateUrl: './toolbar-designer-white.component.html',
  styleUrls: ['./toolbar-designer-white.component.scss'],
})
export class ToolbarDesignerWhiteComponent  implements OnInit {

  public ip_address = IP_ADDRESS;
  constructor(
    private navController: NavController,
  ) { }

  ngOnInit() {}
  go_page(name: string){
    console.log("ads");
    this.navController.navigateForward('/'+name);
  }

}
