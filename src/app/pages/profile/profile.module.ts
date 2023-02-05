import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProfilePageRoutingModule } from './profile-routing.module';

import { ProfilePage } from './profile.page';
import { ImageCropperModule } from 'ngx-image-cropper';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ImageCropperModule,
    ReactiveFormsModule,
    ComponentsModule,
    ProfilePageRoutingModule
  ],
  declarations: [ProfilePage]
})
export class ProfilePageModule {}
