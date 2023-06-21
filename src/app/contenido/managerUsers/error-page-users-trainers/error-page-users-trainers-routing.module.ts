import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ErrorPageUsersTrainersPage } from './error-page-users-trainers.page';

const routes: Routes = [
  {
    path: '',
    component: ErrorPageUsersTrainersPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ErrorPageUsersTrainersPageRoutingModule {}
