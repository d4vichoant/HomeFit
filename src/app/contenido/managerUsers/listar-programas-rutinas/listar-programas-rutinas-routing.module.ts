import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListarProgramasRutinasPage } from './listar-programas-rutinas.page';

const routes: Routes = [
  {
    path: '',
    component: ListarProgramasRutinasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListarProgramasRutinasPageRoutingModule {}
