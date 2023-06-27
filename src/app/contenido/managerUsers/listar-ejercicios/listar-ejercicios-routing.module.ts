import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListarEjerciciosPage } from './listar-ejercicios.page';

const routes: Routes = [
  {
    path: '',
    component: ListarEjerciciosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListarEjerciciosPageRoutingModule {}
