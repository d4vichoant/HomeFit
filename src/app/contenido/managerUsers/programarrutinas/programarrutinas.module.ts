import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProgramarrutinasPageRoutingModule } from './programarrutinas-routing.module';

import { ProgramarrutinasPage } from './programarrutinas.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProgramarrutinasPageRoutingModule
  ],
  declarations: [ProgramarrutinasPage]
})
export class ProgramarrutinasPageModule {}
