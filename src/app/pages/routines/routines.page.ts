import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { ArrowLeftIcon, LucideAngularModule, PlusIcon } from 'lucide-angular';
import { Subscription } from 'rxjs';
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
    IonicModule,
    RoutineEditorComponent,
    RoutineCardComponent,
    LucideAngularModule
  ],
})
export class RoutinesPage implements OnInit, OnDestroy {
  readonly plusIcon = PlusIcon;
  readonly backIcon = ArrowLeftIcon

  subscriptions: Subscription[] = [];

  enabledRoutines: Routine[] = [];
  disabledRoutines: Routine[] = [];

  loadingEvent: any;

  completedFirstLoad = false;

  newRoutineEditorIsOpen = false;

  updateRoutineEditorOpenId = -1;

  constructor(private router: Router, private taskService: TaskService) {}

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

        if (this.loadingEvent) {
          this.loadingEvent.target.complete();
        }
      })
    );

    this.getRoutines();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  getRoutines(event?) {
    if (event) {
      this.loadingEvent = event;
    }

    this.taskService.fetchRoutinesFromApi();
  }

  openNewRoutineEditor(state: boolean) {
    this.newRoutineEditorIsOpen = state;
  }

  openUpdateEditor(routineId: number) {
    this.updateRoutineEditorOpenId = routineId;
  }

  gotoTasks() {
    this.router.navigate(['tasks']);
  }
}
