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

  routines: Routine[] = [];

  constructor(
    private router: Router,
    private taskService: TaskService
  ) { }

  ngOnInit() {
    this.taskService.getRoutines().subscribe(routines => {
      this.routines = routines;
      console.log(this.routines);
    });
  }

  gotoTasks() {
    this.router.navigate(['/tabs/tasks']);
  }

}
