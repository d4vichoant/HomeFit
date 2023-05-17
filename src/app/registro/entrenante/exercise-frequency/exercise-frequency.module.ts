import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ExerciseFrequencyPageRoutingModule } from './exercise-frequency-routing.module';

import { ExerciseFrequencyPage } from './exercise-frequency.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ExerciseFrequencyPageRoutingModule
  ],
  declarations: [ExerciseFrequencyPage]
})
export class ExerciseFrequencyPageModule {}
