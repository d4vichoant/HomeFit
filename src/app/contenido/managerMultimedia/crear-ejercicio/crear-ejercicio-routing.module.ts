import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CrearEjercicioPage } from './crear-ejercicio.page';

const routes: Routes = [
  {
    path: '',
    component: CrearEjercicioPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CrearEjercicioPageRoutingModule {}
