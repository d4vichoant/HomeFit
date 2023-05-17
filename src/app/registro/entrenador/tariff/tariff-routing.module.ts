import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TariffPage } from './tariff.page';

const routes: Routes = [
  {
    path: '',
    component: TariffPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TariffPageRoutingModule {}
