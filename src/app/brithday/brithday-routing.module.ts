import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BrithdayPage } from './brithday.page';

const routes: Routes = [
  {
    path: '',
    component: BrithdayPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BrithdayPageRoutingModule {}
