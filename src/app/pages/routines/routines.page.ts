import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Routine } from 'src/app/models/routine';
import { User } from 'src/app/models/user';
import { TaskService } from 'src/app/services/task.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-routines',
  templateUrl: './routines.page.html',
  styleUrls: ['./routines.page.scss'],
})
export class RoutinesPage implements OnInit {

  routines: Routine[] = [];

  newRoutineForm: FormGroup;

  newRoutineEditorIsOpen = false;

  usersInCommunity: User[] = [];

  constructor(
    private router: Router,
    private taskService: TaskService,
    private userService: UserService
  ) {
    this.newRoutineForm = new FormGroup({
      name: new FormControl<string | null>('', [Validators.minLength(1), Validators.required]),
      notes: new FormControl<string | null>(''),
      startdate: new FormControl<string | null>('', [Validators.minLength(1), Validators.required]),
      interval: new FormControl<string | null>('', [Validators.pattern(/^[1-9][0-9]*$/), Validators.required])
    });
  }

  get nameControl() {
    return this.newRoutineForm.get('name');
  }

  get notesControl() {
    return this.newRoutineForm.get('notes');
  }

  get startdateControl() {
    return this.newRoutineForm.get('startdate');
  }

  get intervalControl() {
    return this.newRoutineForm.get('interval');
  }

  ngOnInit() {
    this.taskService.getRoutines().subscribe(routines => {
      this.routines = routines;
      console.log(this.routines);
    });

    this.userService.getUsersInCurrentCommunity().subscribe(users => {
      this.usersInCommunity = users;
    });

    this.startdateControl.setValue(new Date().toISOString());
  }

  openNewRoutineEditor(state: boolean) {
    this.newRoutineEditorIsOpen = state;
  }

  saveNewRoutine() {
    const startDate = new Date(this.startdateControl.value);
    const routine = new Routine(null, this.nameControl.value, this.notesControl.value, startDate, this.intervalControl.value, null, []);
    this.taskService.addRoutine(routine).subscribe(res => {
      console.log(res);
      if (res.status === 'OK') {
        this.openNewRoutineEditor(false);
        this.newRoutineForm.reset();
      }
    });
  }

  updateRoutine() {

  }

  gotoTasks() {
    this.router.navigate(['/tabs/tasks']);
  }

}
