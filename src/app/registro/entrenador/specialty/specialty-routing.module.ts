import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SpecialtyPage } from './specialty.page';

const routes: Routes = [
  {
    path: '',
    component: SpecialtyPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SpecialtyPageRoutingModule {}
