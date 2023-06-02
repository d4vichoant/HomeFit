import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CrearTipoEjercicioPage } from './crear-tipo-ejercicio.page';

const routes: Routes = [
  {
    path: '',
    component: CrearTipoEjercicioPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CrearTipoEjercicioPageRoutingModule {}
