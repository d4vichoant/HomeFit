import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ErrorUsersPageRoutingModule } from './error-users-routing.module';

import { ErrorUsersPage } from './error-users.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ErrorUsersPageRoutingModule
  ],
  declarations: [ErrorUsersPage]
})
export class ErrorUsersPageModule {}
