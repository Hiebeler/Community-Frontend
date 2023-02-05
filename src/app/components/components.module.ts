import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { TaskCardComponent } from './task-card/task-card.component';
import { RoutineEditorComponent } from './routine-editor/routine-editor.component';
import { RoutineCardComponent } from './routine-card/routine-card.component';
import { ColorEditorComponent } from './color-editor/color-editor.component';

@NgModule({
  declarations: [
    TaskCardComponent,
    RoutineEditorComponent,
    RoutineCardComponent,
    ColorEditorComponent
  ],
  exports: [
    TaskCardComponent,
    RoutineEditorComponent,
    RoutineCardComponent,
    ColorEditorComponent
  ],
  imports: [
    IonicModule,
    CommonModule,
    ReactiveFormsModule
  ]
})
export class ComponentsModule { }
