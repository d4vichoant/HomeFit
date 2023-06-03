import { NgModule,CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ControlMultimediaPageRoutingModule } from './control-multimedia-routing.module';

import { ControlMultimediaPage } from './control-multimedia.page';

import { SharedModule } from '../../../shared.module';


@NgModule({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ControlMultimediaPageRoutingModule,
    SharedModule,
  ],
  declarations: [ControlMultimediaPage]
})
export class ControlMultimediaPageModule {}
