import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NotactivatePageRoutingModule } from './notactivate-routing.module';

import { NotactivatePage } from './notactivate.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NotactivatePageRoutingModule
  ],
  declarations: [NotactivatePage]
})
export class NotactivatePageModule {}
