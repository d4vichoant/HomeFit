import { NgModule,CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HalfTimePageRoutingModule } from './half-time-routing.module';

import { HalfTimePage } from './half-time.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HalfTimePageRoutingModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  declarations: [HalfTimePage]
})
export class HalfTimePageModule {}
