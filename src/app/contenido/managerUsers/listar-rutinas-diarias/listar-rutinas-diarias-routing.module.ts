import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListarRutinasDiariasPage } from './listar-rutinas-diarias.page';

const routes: Routes = [
  {
    path: '',
    component: ListarRutinasDiariasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListarRutinasDiariasPageRoutingModule {}
