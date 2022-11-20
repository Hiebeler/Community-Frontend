import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TaskCardComponent } from './task-card/task-card.component';

@NgModule({
  declarations: [
    TaskCardComponent
  ],
  exports: [
    TaskCardComponent
  ],
  imports: [
    IonicModule,
    CommonModule
  ]
})
export class ComponentsModule { }
