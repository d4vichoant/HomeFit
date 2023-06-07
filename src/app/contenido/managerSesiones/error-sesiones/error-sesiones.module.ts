import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ErrorSesionesPageRoutingModule } from './error-sesiones-routing.module';

import { ErrorSesionesPage } from './error-sesiones.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ErrorSesionesPageRoutingModule
  ],
  declarations: [ErrorSesionesPage]
})
export class ErrorSesionesPageModule {}
