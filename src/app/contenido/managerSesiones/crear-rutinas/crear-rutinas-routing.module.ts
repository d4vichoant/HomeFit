import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CrearRutinasPage } from './crear-rutinas.page';

const routes: Routes = [
  {
    path: '',
    component: CrearRutinasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CrearRutinasPageRoutingModule {}
