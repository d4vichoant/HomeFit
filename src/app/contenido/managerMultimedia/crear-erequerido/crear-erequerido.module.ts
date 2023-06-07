import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CrearERequeridoPageRoutingModule } from './crear-erequerido-routing.module';

import { CrearERequeridoPage } from './crear-erequerido.page';

import { SharedModule } from '../../../shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CrearERequeridoPageRoutingModule,
    SharedModule
  ],
  declarations: [CrearERequeridoPage]
})
export class CrearERequeridoPageModule {}
