import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CrearMultimediaPageRoutingModule } from './crear-multimedia-routing.module';

import { CrearMultimediaPage } from './crear-multimedia.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CrearMultimediaPageRoutingModule
  ],
  declarations: [CrearMultimediaPage]
})
export class CrearMultimediaPageModule {}
