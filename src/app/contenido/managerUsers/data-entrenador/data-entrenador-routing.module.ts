import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DataEntrenadorPage } from './data-entrenador.page';

const routes: Routes = [
  {
    path: '',
    component: DataEntrenadorPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DataEntrenadorPageRoutingModule {}
