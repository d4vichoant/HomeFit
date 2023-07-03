import { NgModule,CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListarGuardadosPageRoutingModule } from './listar-guardados-routing.module';

import { ListarGuardadosPage } from './listar-guardados.page';
import { SharedModule } from '../../../shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListarGuardadosPageRoutingModule,
    SharedModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  declarations: [ListarGuardadosPage]
})
export class ListarGuardadosPageModule {}
