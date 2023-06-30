import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListarParametrosPage } from './listar-parametros.page';

const routes: Routes = [
  {
    path: '',
    component: ListarParametrosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListarParametrosPageRoutingModule {}
