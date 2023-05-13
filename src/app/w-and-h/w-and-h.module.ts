import { NgModule,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { WAndHPageRoutingModule } from './w-and-h-routing.module';

import { WAndHPage } from './w-and-h.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    WAndHPageRoutingModule
  ],
  declarations: [WAndHPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class WAndHPageModule {}
