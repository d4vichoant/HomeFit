import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ObjetivePageRoutingModule } from './objetive-routing.module';

import { ObjetivePage } from './objetive.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ObjetivePageRoutingModule
  ],
  declarations: [ObjetivePage]
})
export class ObjetivePageModule {}
