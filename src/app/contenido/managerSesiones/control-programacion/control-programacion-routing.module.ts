import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ControlProgramacionPage } from './control-programacion.page';

const routes: Routes = [
  {
    path: '',
    component: ControlProgramacionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ControlProgramacionPageRoutingModule {}
