import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SpecialtyPageRoutingModule } from './specialty-routing.module';

import { SpecialtyPage } from './specialty.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SpecialtyPageRoutingModule
  ],
  declarations: [SpecialtyPage]
})
export class SpecialtyPageModule {}
