import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListarEjerciciosAllPage } from './listar-ejercicios-all.page';

const routes: Routes = [
  {
    path: '',
    component: ListarEjerciciosAllPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListarEjerciciosAllPageRoutingModule {}
