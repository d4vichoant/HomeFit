import { NgModule,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CrearObjetivoMuscularPageRoutingModule } from './crear-objetivo-muscular-routing.module';

import { CrearObjetivoMuscularPage } from './crear-objetivo-muscular.page';
import { SharedModule } from '../../../shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CrearObjetivoMuscularPageRoutingModule,
    SharedModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  declarations: [CrearObjetivoMuscularPage]
})
export class CrearObjetivoMuscularPageModule {}
