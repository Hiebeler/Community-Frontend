import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { TaskCardComponent } from './task-card/task-card.component';
import { RoutineEditorComponent } from './routine-editor/routine-editor.component';
import { RoutineCardComponent } from './routine-card/routine-card.component';
import { ColorEditorComponent } from './color-editor/color-editor.component';
import { ProfileImageEditorComponent } from './profile-image-editor/profile-image-editor.component';
import { ImageCropperModule } from 'ngx-image-cropper';

@NgModule({
  declarations: [
    TaskCardComponent,
    RoutineEditorComponent,
    RoutineCardComponent,
    ColorEditorComponent,
    ProfileImageEditorComponent
  ],
  exports: [
    TaskCardComponent,
    RoutineEditorComponent,
    RoutineCardComponent,
    ColorEditorComponent,
    ProfileImageEditorComponent
  ],
  imports: [
    IonicModule,
    CommonModule,
    ReactiveFormsModule,
    ImageCropperModule
  ]
})
export class ComponentsModule { }
