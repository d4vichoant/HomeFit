import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListarRutinasDiariasPageRoutingModule } from './listar-rutinas-diarias-routing.module';

import { ListarRutinasDiariasPage } from './listar-rutinas-diarias.page';
import { SharedModule } from '../../../shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListarRutinasDiariasPageRoutingModule,
    SharedModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  declarations: [ListarRutinasDiariasPage]
})
export class ListarRutinasDiariasPageModule {}
