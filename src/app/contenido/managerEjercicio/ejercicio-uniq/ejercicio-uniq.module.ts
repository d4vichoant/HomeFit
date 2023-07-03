import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EjercicioUniqPageRoutingModule } from './ejercicio-uniq-routing.module';

import { EjercicioUniqPage } from './ejercicio-uniq.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EjercicioUniqPageRoutingModule
  ],
  declarations: [EjercicioUniqPage]
})
export class EjercicioUniqPageModule {}
