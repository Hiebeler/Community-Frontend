import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RoutinesPageRoutingModule } from './routines-routing.module';

import { RoutinesPage } from './routines.page';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    ComponentsModule,
    RoutinesPageRoutingModule
  ],
  declarations: [RoutinesPage]
})
export class RoutinesPageModule {}
