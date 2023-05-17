import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProfileBasicPageRoutingModule } from './profile-basic-routing.module';

import { ProfileBasicPage } from './profile-basic.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    ProfileBasicPageRoutingModule
  ],
  declarations: [ProfileBasicPage]
})
export class ProfileBasicPageModule {}
