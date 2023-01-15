import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TaskCardComponent } from './task-card/task-card.component';
import { RoutineEditorComponent } from './routine-editor/routine-editor.component';
import { RoutineCardComponent } from './routine-card/routine-card.component';

@NgModule({
  declarations: [
    TaskCardComponent,
    RoutineEditorComponent,
    RoutineCardComponent
  ],
  exports: [
    TaskCardComponent,
    RoutineEditorComponent,
    RoutineCardComponent
  ],
  imports: [
    IonicModule,
    CommonModule,
    ReactiveFormsModule
  ]
})
export class ComponentsModule { }
