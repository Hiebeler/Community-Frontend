import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CreateCommunityPageRoutingModule } from './create-community-routing.module';

import { CreateCommunityPage } from './create-community.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    CreateCommunityPageRoutingModule
  ],
  declarations: [CreateCommunityPage]
})
export class CreateCommunityPageModule {}
