import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VideoUniqPageRoutingModule } from './video-uniq-routing.module';

import { VideoUniqPage } from './video-uniq.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VideoUniqPageRoutingModule
  ],
  declarations: [VideoUniqPage]
})
export class VideoUniqPageModule {}
