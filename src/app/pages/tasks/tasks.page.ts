import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { TaskAdapter } from 'src/app/adapter/task-adapter';
import { TaskPage } from 'src/app/modals/task/task.page';
import { Day } from 'src/app/models/day';
import { Task } from 'src/app/models/task';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.page.html',
  styleUrls: ['./tasks.page.scss'],
})
export class TasksPage implements OnInit {

  numberOfColumns = 3;

  days: Day[] = [];

  dayToday: Date;

  startDate: Date;
  endDate: Date;

  constructor(
    private apiService: ApiService,
    private modalController: ModalController,
    private taskAdapter: TaskAdapter
  ) { }

  ngOnInit() {
    this.dayToday = new Date();

    if (this.numberOfColumns === 7) {
      this.startDate = this.getMondayOfCurrentWeek();
    this.endDate = this.addDate(this.startDate, this.numberOfColumns - 1);
    }
    else {
      this.startDate = new Date();
      this.endDate = this.addDate(this.startDate, this.numberOfColumns - 1);
    }

    this.getTasks();
  }

  getTasks(event?) {
    const params: any = {
      startDate: this.startDate,
      endDate: this.endDate
    };

    this.apiService.getTasks(params).subscribe((tasks) => {
        this.days = [];

        for (let i = 0; i < this.numberOfColumns; i++) {
          const currentDate = this.addDate(this.startDate, i);
          const currentDateString = this.formatDate(currentDate);

          const openTasks: Task[] = [];
          const doneTasks: Task[] = [];

          tasks.forEach(task => {
            if (this.formatDate(task.date) === currentDateString) {
              if (task.done) {
                doneTasks.push(task);
              } else {
                openTasks.push(task);
              }

            }
          });

          this.days.push(new Day({ name: i.toString(), openTasks, doneTasks, date: new Date(currentDate) }));
        }

        if (event) {
          event.target.complete();
        }
    });
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

  async openModal(data: Task | Date) {
    let task: Task;
    if (data instanceof Date) {
      task = this.taskAdapter.adapt({ date: data });
    } else {
      task = data;
      task.date = new Date(data.date);
    }
    const modal = await this.modalController.create({
      component: TaskPage,
      cssClass: 'bezahlen-modal',
      canDismiss: true,
      componentProps: {
        task,
        getTasks: this.getTasks.bind(this)
      },
      presentingElement: await this.modalController.getTop()
    }
    );

    return await modal.present();
  }

  changeSelectedDays(direction: 'previous' | 'next') {
    if (direction === 'next') {
      this.startDate = this.addDate(this.startDate, this.numberOfColumns);
      this.endDate = this.addDate(this.endDate, this.numberOfColumns);
      this.getTasks();
    }
    else if (direction === 'previous') {
      this.startDate = this.addDate(this.startDate, - this.numberOfColumns);
      this.endDate = this.addDate(this.endDate, this.numberOfColumns);
      this.getTasks();
    }
  }

  isTodayDate(date: Date, offset: number): boolean {
    return date.toDateString() === this.addDate(new Date(), offset).toDateString();
  }
}
