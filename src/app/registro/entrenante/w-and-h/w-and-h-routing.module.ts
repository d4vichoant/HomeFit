import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WAndHPage } from './w-and-h.page';

const routes: Routes = [
  {
    path: '',
    component: WAndHPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WAndHPageRoutingModule {}
