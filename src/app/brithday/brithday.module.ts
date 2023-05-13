import { NgModule,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BrithdayPageRoutingModule } from './brithday-routing.module';

import { BrithdayPage } from './brithday.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BrithdayPageRoutingModule
  ],
  declarations: [BrithdayPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class BrithdayPageModule {}
