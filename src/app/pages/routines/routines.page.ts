import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Routine } from 'src/app/models/routine';
import { TaskService } from 'src/app/services/task.service';

@Component({
  selector: 'app-routines',
  templateUrl: './routines.page.html',
  styleUrls: ['./routines.page.scss'],
})
export class RoutinesPage implements OnInit {

  enabledRoutines: Routine[] = [];
  disabledRoutines: Routine[] = [];

  loadingEvent: any;

  newRoutineEditorIsOpen = false;

  updateRoutineEditorOpenId = -1;

  constructor(
    private router: Router,
    private taskService: TaskService
  ) { }

  ngOnInit() {
    this.getRoutines();
  }

  getRoutines(event?) {
    if (event) {
      this.loadingEvent = event;
    }
    this.taskService.getRoutines().subscribe(routines => {
      this.enabledRoutines = [];
      this.disabledRoutines = [];

      routines.map(routine => {
        if (routine.active) {
          this.enabledRoutines.push(routine);
        } else {
          this.disabledRoutines.push(routine);
        }
      });

      if (this.loadingEvent) {
        this.loadingEvent.target.complete();
      }
    });
  }

  openNewRoutineEditor(state: boolean) {
    this.newRoutineEditorIsOpen = state;
  }

  openUpdateEditor(routineId: number) {
    this.updateRoutineEditorOpenId = routineId;
  }

  gotoTasks() {
    this.router.navigate(['/tabs/tasks']);
  }

}
