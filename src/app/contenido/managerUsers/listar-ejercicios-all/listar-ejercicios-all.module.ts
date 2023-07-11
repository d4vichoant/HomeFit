import { NgModule,CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListarEjerciciosAllPageRoutingModule } from './listar-ejercicios-all-routing.module';

import { ListarEjerciciosAllPage } from './listar-ejercicios-all.page';
import { SharedModule } from '../../../shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListarEjerciciosAllPageRoutingModule,
    SharedModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  declarations: [ListarEjerciciosAllPage]
})
export class ListarEjerciciosAllPageModule {}
