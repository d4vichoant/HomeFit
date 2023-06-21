import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ErrorPageUsersTrainersPageRoutingModule } from './error-page-users-trainers-routing.module';

import { ErrorPageUsersTrainersPage } from './error-page-users-trainers.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ErrorPageUsersTrainersPageRoutingModule
  ],
  declarations: [ErrorPageUsersTrainersPage]
})
export class ErrorPageUsersTrainersPageModule {}
