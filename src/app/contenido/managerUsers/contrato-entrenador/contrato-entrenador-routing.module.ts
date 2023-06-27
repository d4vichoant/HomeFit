import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ContratoEntrenadorPage } from './contrato-entrenador.page';

const routes: Routes = [
  {
    path: '',
    component: ContratoEntrenadorPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ContratoEntrenadorPageRoutingModule {}
