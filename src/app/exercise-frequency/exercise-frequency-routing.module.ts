import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ExerciseFrequencyPage } from './exercise-frequency.page';

const routes: Routes = [
  {
    path: '',
    component: ExerciseFrequencyPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ExerciseFrequencyPageRoutingModule {}
