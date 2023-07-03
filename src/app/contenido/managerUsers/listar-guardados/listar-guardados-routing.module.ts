import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListarGuardadosPage } from './listar-guardados.page';

const routes: Routes = [
  {
    path: '',
    component: ListarGuardadosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListarGuardadosPageRoutingModule {}
