import { NgModule,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DataEntrenadorPageRoutingModule } from './data-entrenador-routing.module';

import { DataEntrenadorPage } from './data-entrenador.page';
import { SharedModule } from '../../../shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DataEntrenadorPageRoutingModule,
    SharedModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  declarations: [DataEntrenadorPage]
})
export class DataEntrenadorPageModule {}
