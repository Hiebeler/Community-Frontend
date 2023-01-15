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

  updateRoutineEditorOpenId = -1;

  usersInCommunity: User[] = [];

  constructor(
    private router: Router,
    private taskService: TaskService,
    private userService: UserService
  ) { }

  ngOnInit() {
    this.taskService.getRoutines().subscribe(routines => {
      this.routines = routines;
    });

    this.userService.getUsersInCurrentCommunity().subscribe(users => {
      this.usersInCommunity = users;
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
