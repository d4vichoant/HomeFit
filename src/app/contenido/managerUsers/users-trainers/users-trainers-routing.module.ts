import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UsersTrainersPage } from './users-trainers.page';

const routes: Routes = [
  {
    path: '',
    component: UsersTrainersPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UsersTrainersPageRoutingModule {}
