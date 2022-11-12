import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
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

  allTasks: any;

  days: Day[] = [];

  dayToday: Date;

  startDate: Date;
  endDate: Date;

  constructor(
    private apiService: ApiService,
    private modalController: ModalController
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
      if (tasks.status === 'OK') {
        this.days = [];
        this.allTasks = tasks.data;
        const mondayDate = this.startDate;

        for (let i = 0; i < this.numberOfColumns; i++) {
          const currentDate = new Date();
          currentDate.setDate(mondayDate.getDate() + i);
          const currentDateString = this.formatDate(currentDate);

          const zwischentasks: Task[] = [];

          this.allTasks.forEach(task => {
            if (task.date.toString().substring(0, 10) === currentDateString) {
              zwischentasks.push(new Task(task));
            }
          });

          this.days.push(new Day({ name: i.toString(), tasks: zwischentasks, date: new Date(currentDate) }));
        }

        console.log(this.days);

        if (event) {
          event.target.complete();
        }
      }
    });
  }

  addDate(date: Date, daysToAdd: number) {
    const result = new Date(date);
    result.setDate(result.getDate() + daysToAdd);
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
      task = new Task({ date: data });
    } else {
      task = data;
      task.date = new Date(data.date);
    }
    const modal = await this.modalController.create({
      component: TaskPage,
      cssClass: 'bezahlen-modal',
      canDismiss: true,
      componentProps: {
        task
      },
      presentingElement: await this.modalController.getTop()
    });
    modal.onDidDismiss().then(() => {
    });

    return await modal.present();
  }

  changeSelectedDays(direction: 'previous' | 'next') {
    if (direction === 'next') {
      this.startDate = this.addDate(this.endDate, 1);
      this.endDate = this.addDate(this.startDate, this.numberOfColumns-1);
      this.getTasks();
    }
    else if (direction === 'previous') {
      this.startDate = this.addDate(this.startDate, - this.numberOfColumns);
      this.endDate = this.addDate(this.startDate, this.numberOfColumns-1);
      this.getTasks();
    }
  }
}
