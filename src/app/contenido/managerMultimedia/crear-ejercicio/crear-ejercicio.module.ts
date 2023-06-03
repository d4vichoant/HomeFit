import { NgModule ,CUSTOM_ELEMENTS_SCHEMA }  from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CrearEjercicioPageRoutingModule } from './crear-ejercicio-routing.module';

import { CrearEjercicioPage } from './crear-ejercicio.page';

import { SharedModule } from '../../../shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CrearEjercicioPageRoutingModule,
    SharedModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  declarations: [CrearEjercicioPage]
})
export class CrearEjercicioPageModule {}
