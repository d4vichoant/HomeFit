import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ActivateEntrenadoresPageRoutingModule } from './activate-entrenadores-routing.module';

import { ActivateEntrenadoresPage } from './activate-entrenadores.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ActivateEntrenadoresPageRoutingModule
  ],
  declarations: [ActivateEntrenadoresPage]
})
export class ActivateEntrenadoresPageModule {}
