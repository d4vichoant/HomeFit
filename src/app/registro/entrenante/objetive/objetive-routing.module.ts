import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ObjetivePage } from './objetive.page';

const routes: Routes = [
  {
    path: '',
    component: ObjetivePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ObjetivePageRoutingModule {}
