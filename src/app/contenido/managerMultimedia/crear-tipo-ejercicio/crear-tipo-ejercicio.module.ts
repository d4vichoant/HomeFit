import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CrearTipoEjercicioPageRoutingModule } from './crear-tipo-ejercicio-routing.module';

import { CrearTipoEjercicioPage } from './crear-tipo-ejercicio.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CrearTipoEjercicioPageRoutingModule
  ],
  declarations: [CrearTipoEjercicioPage]
})
export class CrearTipoEjercicioPageModule {}
