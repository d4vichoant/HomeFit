import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ErrorvideosPageRoutingModule } from './errorvideos-routing.module';

import { ErrorvideosPage } from './errorvideos.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ErrorvideosPageRoutingModule
  ],
  declarations: [ErrorvideosPage]
})
export class ErrorvideosPageModule {}
