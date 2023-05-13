import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NotificationPermissionPageRoutingModule } from './notification-permission-routing.module';

import { NotificationPermissionPage } from './notification-permission.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NotificationPermissionPageRoutingModule
  ],
  declarations: [NotificationPermissionPage]
})
export class NotificationPermissionPageModule {}
