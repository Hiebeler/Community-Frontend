import { Component, OnInit } from '@angular/core';
import { Day } from 'src/app/models/day';
import { Task } from 'src/app/models/task';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.page.html',
  styleUrls: ['./tasks.page.scss'],
})
export class TasksPage implements OnInit {

  allTasks: any;

  days: Day[] = [];

  constructor(
    private apiService: ApiService
  ) { }

  ngOnInit() {
    const params = {
      startDate: '2022-11-07',
      endDate: '2022-11-11'
    };
    this.apiService.getTasks(params).subscribe((tasks) => {
      if (tasks.status === 'OK') {
        this.allTasks = tasks.data;
        console.log(this.allTasks);
        const mondayDate = this.getMondayOfCurrentWeek();

        for (let i = 0; i < 7; i++) {
          const currentDate = new Date();
          currentDate.setDate(mondayDate.getDate() + i);
          const currentDateString = this.formatDate(currentDate);
          console.log(currentDateString);

          const zwischentasks: Task[] = [];

          this.allTasks.forEach(task => {
            if (task.date.toString().substring(0, 10) === currentDateString) {
              zwischentasks.push(new Task(task));
            }
          });

          this.days.push(new Day({ name: i.toString(), tasks: zwischentasks}));
        }

        console.log(this.days);
      }
    });

    console.log(this.formatDate(this.getMondayOfCurrentWeek()));
  }

  getMondayOfCurrentWeek() {
    const today = new Date();
    const first = today.getDate() - today.getDay() + 1;

    const monday: Date = new Date(today.setDate(first));
    return monday;
  }

  formatDate(date) {
    return [
      date.getFullYear(),
      this.padTo2Digits(date.getMonth() + 1),
      this.padTo2Digits(date.getDate()),
    ].join('-');
  }

  padTo2Digits(num) {
    return num.toString().padStart(2, '0');
  }

}
