import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProgramarrutinasPage } from './programarrutinas.page';

const routes: Routes = [
  {
    path: '',
    component: ProgramarrutinasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProgramarrutinasPageRoutingModule {}
