import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HashAccountPage } from './hash-account.page';

const routes: Routes = [
  {
    path: '',
    component: HashAccountPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HashAccountPageRoutingModule {}
