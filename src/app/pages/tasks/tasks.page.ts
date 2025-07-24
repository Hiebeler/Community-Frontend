import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { TaskAdapter } from 'src/app/adapter/task-adapter';
import { TaskCardComponent } from 'src/app/components/task-card/task-card.component';
import { TaskPage } from 'src/app/modals/task/task.page';
import { Day } from 'src/app/models/day';
import { Task } from 'src/app/models/task';
import { TaskService } from 'src/app/services/task.service';
import {
  LucideAngularModule,
  InfinityIcon,
  ChevronRightIcon,
  ChevronLeftIcon,
} from 'lucide-angular';
import { PopupComponent } from 'src/app/components/popup/popup.component';
import { CommunityService } from 'src/app/services/community.service';
import { Navbar } from 'src/app/components/navbar/navbar';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.page.html',
  standalone: true,
  imports: [
    CommonModule,
    TaskCardComponent,
    LucideAngularModule,
    PopupComponent,
    TaskPage,
    Navbar
  ],
})
export class TasksPage implements OnInit, OnDestroy {
  readonly InfinityIcon = InfinityIcon;
  readonly ChevronRightIcon = ChevronRightIcon;
  readonly ChevronLeftIcon = ChevronLeftIcon;

  subscriptions: Subscription[] = [];

  numberOfColumns = 3;

  days: Day[] = [];

  dayToday: Date;

  startDate: Date;
  endDate: Date;

  taskToShow: Task = null;

  constructor(
    private taskService: TaskService,
    private taskAdapter: TaskAdapter,
    private router: Router,
    private communityService: CommunityService
  ) {
    this.subscriptions.push(this.communityService.getCurrentCommunity().subscribe(community => {
      this.getTasks();
    }));
  }

  ngOnInit() {
    this.dayToday = new Date();

    if (this.numberOfColumns === 7) {
      this.startDate = this.getMondayOfCurrentWeek();
      this.endDate = this.addDate(this.startDate, this.numberOfColumns - 1);
    } else {
      this.startDate = new Date();
      this.endDate = this.addDate(this.startDate, this.numberOfColumns - 1);
    }

    this.getTasks();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  getTasks(event?) {
    this.subscriptions.push(
      this.taskService
        .getTasks(this.startDate, this.endDate)
        .subscribe((tasks) => {
          this.days = [];

          for (let i = 0; i < this.numberOfColumns; i++) {
            const currentDate = this.addDate(this.startDate, i);
            const currentDateString = this.formatDate(currentDate);

            const openTasks: Task[] = [];
            const doneTasks: Task[] = [];

            tasks.forEach((task) => {
              if (this.formatDate(task.date) === currentDateString) {
                if (task.done) {
                  doneTasks.push(task);
                } else {
                  openTasks.push(task);
                }
              }
            });

            this.days.push(
              new Day(i.toString(), openTasks, doneTasks, new Date(currentDate))
            );
          }

          if (event) {
            event.target.complete();
          }
        })
    );
  }

  addDate(date: Date, daysToAdd: number) {
    const result = new Date(Number(date));
    result.setDate(date.getDate() + daysToAdd);
    return result;
  }

  getMondayOfCurrentWeek(): Date {
    const today = new Date();
    const first = today.getDate() - today.getDay() + 1;

    const monday: Date = new Date(today.setDate(first));
    return monday;
  }

  formatDate(date: Date): string {
    return [
      date.getFullYear(),
      this.padTo2Digits(date.getMonth() + 1),
      this.padTo2Digits(date.getDate()),
    ].join('-');
  }

  padTo2Digits(num: number): string {
    return num.toString().padStart(2, '0');
  }

  openModal(data: Task | Date) {
    let task: Task;
    if (data instanceof Date) {
      task = this.taskAdapter.adapt({ date: data });
    } else {
      task = data;
      task.date = new Date(data.date);
    }

    this.taskToShow = task;
  }

  changeSelectedDays(direction: 'previous' | 'next') {
    if (direction === 'next') {
      this.startDate = this.addDate(this.startDate, this.numberOfColumns);
      this.endDate = this.addDate(this.endDate, this.numberOfColumns);
      this.getTasks();
    } else if (direction === 'previous') {
      this.startDate = this.addDate(this.startDate, -this.numberOfColumns);
      this.endDate = this.addDate(this.endDate, this.numberOfColumns);
      this.getTasks();
    }
  }

  isTodayDate(date: Date, offset: number): boolean {
    return (
      date.toDateString() === this.addDate(new Date(), offset).toDateString()
    );
  }

  gotoRoutines() {
    this.router.navigate(['calendar/routines']);
  }
}
