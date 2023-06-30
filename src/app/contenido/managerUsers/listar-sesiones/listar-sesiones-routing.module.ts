import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListarSesionesPage } from './listar-sesiones.page';

const routes: Routes = [
  {
    path: '',
    component: ListarSesionesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListarSesionesPageRoutingModule {}
