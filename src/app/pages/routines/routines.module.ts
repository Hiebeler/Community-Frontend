import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RoutinesPageRoutingModule } from './routines-routing.module';

import { RoutinesPage } from './routines.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RoutinesPageRoutingModule
  ],
  declarations: [RoutinesPage]
})
export class RoutinesPageModule {}
