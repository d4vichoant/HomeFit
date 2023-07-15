import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VideoUniqPage } from './video-uniq.page';

const routes: Routes = [
  {
    path: '',
    component: VideoUniqPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VideoUniqPageRoutingModule {}
