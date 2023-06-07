import { NgModule,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ControlProgramacionPageRoutingModule } from './control-programacion-routing.module';

import { ControlProgramacionPage } from './control-programacion.page';
import { SharedModule } from '../../../shared.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ControlProgramacionPageRoutingModule,
    SharedModule
  ],
  declarations: [ControlProgramacionPage]
})
export class ControlProgramacionPageModule {}
