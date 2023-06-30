import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RutinasDiariasPage } from './rutinas-diarias.page';

const routes: Routes = [
  {
    path: '',
    component: RutinasDiariasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RutinasDiariasPageRoutingModule {}
