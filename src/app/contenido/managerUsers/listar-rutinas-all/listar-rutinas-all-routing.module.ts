import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListarRutinasAllPage } from './listar-rutinas-all.page';

const routes: Routes = [
  {
    path: '',
    component: ListarRutinasAllPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListarRutinasAllPageRoutingModule {}
