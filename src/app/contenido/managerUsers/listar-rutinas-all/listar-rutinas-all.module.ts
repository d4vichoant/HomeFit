import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListarRutinasAllPageRoutingModule } from './listar-rutinas-all-routing.module';

import { ListarRutinasAllPage } from './listar-rutinas-all.page';
import { SharedModule } from '../../../shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListarRutinasAllPageRoutingModule,
    SharedModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  declarations: [ListarRutinasAllPage]
})
export class ListarRutinasAllPageModule {}
