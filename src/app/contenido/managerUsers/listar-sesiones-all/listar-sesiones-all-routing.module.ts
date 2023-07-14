import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListarSesionesAllPage } from './listar-sesiones-all.page';

const routes: Routes = [
  {
    path: '',
    component: ListarSesionesAllPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListarSesionesAllPageRoutingModule {}
