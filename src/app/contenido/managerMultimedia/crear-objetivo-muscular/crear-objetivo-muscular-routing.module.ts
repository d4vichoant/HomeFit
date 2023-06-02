import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CrearObjetivoMuscularPage } from './crear-objetivo-muscular.page';

const routes: Routes = [
  {
    path: '',
    component: CrearObjetivoMuscularPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CrearObjetivoMuscularPageRoutingModule {}
