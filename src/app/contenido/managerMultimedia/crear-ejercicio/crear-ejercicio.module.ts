import { NgModule ,CUSTOM_ELEMENTS_SCHEMA }  from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CrearEjercicioPageRoutingModule } from './crear-ejercicio-routing.module';

import { CrearEjercicioPage } from './crear-ejercicio.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CrearEjercicioPageRoutingModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  declarations: [CrearEjercicioPage]
})
export class CrearEjercicioPageModule {}
