import { NgModule,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ContratoEntrenadorPageRoutingModule } from './contrato-entrenador-routing.module';

import { ContratoEntrenadorPage } from './contrato-entrenador.page';
import { SharedModule } from '../../../shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ContratoEntrenadorPageRoutingModule,
    SharedModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  declarations: [ContratoEntrenadorPage]
})
export class ContratoEntrenadorPageModule {}
