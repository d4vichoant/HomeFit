import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ErrorUsersPage } from './error-users.page';

const routes: Routes = [
  {
    path: '',
    component: ErrorUsersPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ErrorUsersPageRoutingModule {}
