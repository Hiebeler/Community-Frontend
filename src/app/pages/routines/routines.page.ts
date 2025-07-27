import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ArrowLeftIcon, LucideAngularModule, PlusIcon } from 'lucide-angular';
import { Subscription } from 'rxjs';
import { Navbar } from 'src/app/components/navbar/navbar';
import { PopupComponent } from 'src/app/components/popup/popup.component';
import { RoutineCardComponent } from 'src/app/components/routine-card/routine-card.component';
import { RoutineEditorComponent } from 'src/app/components/routine-editor/routine-editor.component';
import { Routine } from 'src/app/models/routine';
import { TaskService } from 'src/app/services/task.service';

@Component({
  selector: 'app-routines',
  templateUrl: './routines.page.html',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    RoutineEditorComponent,
    RoutineCardComponent,
    LucideAngularModule,
    PopupComponent,
    Navbar
  ],
})
export class RoutinesPage implements OnInit, OnDestroy {
  readonly plusIcon = PlusIcon;
  readonly backIcon = ArrowLeftIcon

  subscriptions: Subscription[] = [];

  enabledRoutines: Routine[] = [];
  disabledRoutines: Routine[] = [];

  completedFirstLoad = false;

  newRoutineEditorIsOpen = false;

  openRoutineEditor: Routine = null;

  constructor(private taskService: TaskService) {}

  ngOnInit() {
    this.subscriptions.push(
      this.taskService.getRoutines().subscribe((routines) => {
        this.enabledRoutines = [];
        this.disabledRoutines = [];

        this.completedFirstLoad = true;

        routines.map((routine) => {
          if (routine.active) {
            this.enabledRoutines.push(routine);
          } else {
            this.disabledRoutines.push(routine);
          }
        });
      })
    );

    this.getRoutines();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  getRoutines() {
    this.taskService.fetchRoutinesFromApi();
  }

  openNewRoutineEditor(state: boolean) {
    this.newRoutineEditorIsOpen = state;
  }

  openUpdateEditor(routine: Routine) {
    this.openRoutineEditor = routine;
  }
}
