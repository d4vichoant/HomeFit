import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NotificationPermissionPage } from './notification-permission.page';

const routes: Routes = [
  {
    path: '',
    component: NotificationPermissionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NotificationPermissionPageRoutingModule {}
