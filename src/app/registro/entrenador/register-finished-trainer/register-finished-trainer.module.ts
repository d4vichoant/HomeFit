import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RegisterFinishedTrainerPageRoutingModule } from './register-finished-trainer-routing.module';

import { RegisterFinishedTrainerPage } from './register-finished-trainer.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RegisterFinishedTrainerPageRoutingModule
  ],
  declarations: [RegisterFinishedTrainerPage]
})
export class RegisterFinishedTrainerPageModule {}
