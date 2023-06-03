import { NgModule,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CrearTipoEjercicioPageRoutingModule } from './crear-tipo-ejercicio-routing.module';

import { CrearTipoEjercicioPage } from './crear-tipo-ejercicio.page';

import { SharedModule } from '../../../shared.module';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CrearTipoEjercicioPageRoutingModule,
    SharedModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  declarations: [CrearTipoEjercicioPage]
})
export class CrearTipoEjercicioPageModule {}
