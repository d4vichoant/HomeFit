import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CrearObjetivoMuscularPageRoutingModule } from './crear-objetivo-muscular-routing.module';

import { CrearObjetivoMuscularPage } from './crear-objetivo-muscular.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CrearObjetivoMuscularPageRoutingModule
  ],
  declarations: [CrearObjetivoMuscularPage]
})
export class CrearObjetivoMuscularPageModule {}
