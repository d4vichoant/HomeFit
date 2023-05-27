import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ErrorvideosPage } from './errorvideos.page';

const routes: Routes = [
  {
    path: '',
    component: ErrorvideosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ErrorvideosPageRoutingModule {}
