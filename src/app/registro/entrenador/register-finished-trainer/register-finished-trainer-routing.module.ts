import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RegisterFinishedTrainerPage } from './register-finished-trainer.page';

const routes: Routes = [
  {
    path: '',
    component: RegisterFinishedTrainerPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RegisterFinishedTrainerPageRoutingModule {}
