import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HalfTimePage } from './half-time.page';

const routes: Routes = [
  {
    path: '',
    component: HalfTimePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HalfTimePageRoutingModule {}
