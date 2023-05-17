import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NotactivatePage } from './notactivate.page';

const routes: Routes = [
  {
    path: '',
    component: NotactivatePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NotactivatePageRoutingModule {}
