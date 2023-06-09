import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CrearSesionesPage } from './crear-sesiones.page';

const routes: Routes = [
  {
    path: '',
    component: CrearSesionesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CrearSesionesPageRoutingModule {}
