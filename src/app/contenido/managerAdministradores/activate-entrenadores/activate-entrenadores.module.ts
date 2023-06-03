import { NgModule, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ActivateEntrenadoresPageRoutingModule } from './activate-entrenadores-routing.module';

import { ActivateEntrenadoresPage } from './activate-entrenadores.page';
import { SharedModule } from '../../../shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ActivateEntrenadoresPageRoutingModule,
    SharedModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  declarations: [ActivateEntrenadoresPage]
})
export class ActivateEntrenadoresPageModule {}
