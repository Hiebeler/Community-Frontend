import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RoutinesPageRoutingModule } from './routines-routing.module';

import { RoutinesPage } from './routines.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    RoutinesPageRoutingModule
  ],
  declarations: [RoutinesPage]
})
export class RoutinesPageModule {}
