import { NgModule,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProgramarrutinasPageRoutingModule } from './programarrutinas-routing.module';

import { ProgramarrutinasPage } from './programarrutinas.page';
import { SharedModule } from '../../../shared.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProgramarrutinasPageRoutingModule,
    SharedModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  declarations: [ProgramarrutinasPage]
})
export class ProgramarrutinasPageModule {}
