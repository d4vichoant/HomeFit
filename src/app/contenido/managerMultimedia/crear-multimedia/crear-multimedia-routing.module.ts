import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CrearMultimediaPage } from './crear-multimedia.page';

const routes: Routes = [
  {
    path: '',
    component: CrearMultimediaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CrearMultimediaPageRoutingModule {}
