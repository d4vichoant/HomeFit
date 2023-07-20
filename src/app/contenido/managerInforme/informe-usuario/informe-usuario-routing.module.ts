import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InformeUsuarioPage } from './informe-usuario.page';

const routes: Routes = [
  {
    path: '',
    component: InformeUsuarioPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InformeUsuarioPageRoutingModule {}
