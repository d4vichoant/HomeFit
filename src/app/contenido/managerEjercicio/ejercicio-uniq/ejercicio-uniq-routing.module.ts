import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EjercicioUniqPage } from './ejercicio-uniq.page';

const routes: Routes = [
  {
    path: '',
    component: EjercicioUniqPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EjercicioUniqPageRoutingModule {}
