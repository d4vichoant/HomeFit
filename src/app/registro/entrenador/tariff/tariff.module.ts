import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TariffPageRoutingModule } from './tariff-routing.module';

import { TariffPage } from './tariff.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TariffPageRoutingModule
  ],
  declarations: [TariffPage]
})
export class TariffPageModule {}
