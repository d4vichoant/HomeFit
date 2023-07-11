import { NgModule, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListarProgramasRutinasPageRoutingModule } from './listar-programas-rutinas-routing.module';

import { ListarProgramasRutinasPage } from './listar-programas-rutinas.page';
import { SharedModule } from '../../../shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListarProgramasRutinasPageRoutingModule,
    SharedModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  declarations: [ListarProgramasRutinasPage]
})
export class ListarProgramasRutinasPageModule {}
