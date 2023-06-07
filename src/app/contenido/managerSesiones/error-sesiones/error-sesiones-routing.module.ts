import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ErrorSesionesPage } from './error-sesiones.page';

const routes: Routes = [
  {
    path: '',
    component: ErrorSesionesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ErrorSesionesPageRoutingModule {}
