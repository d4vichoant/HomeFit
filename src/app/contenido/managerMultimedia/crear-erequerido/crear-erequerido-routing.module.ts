import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CrearERequeridoPage } from './crear-erequerido.page';

const routes: Routes = [
  {
    path: '',
    component: CrearERequeridoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CrearERequeridoPageRoutingModule {}
