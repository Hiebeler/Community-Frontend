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

  allTasks: any;

  days: Day[] = [];

  dayToday: Date;

  constructor(
    private apiService: ApiService,
    private modalController: ModalController
  ) { }

  ngOnInit() {
    this.dayToday = new Date();

    this.getTasks();
  }

  getTasks(event?) {
    const params = {
      startDate: '2022-11-07',
      endDate: '2022-11-11'
    };

    this.apiService.getTasks(params).subscribe((tasks) => {
      if (tasks.status === 'OK') {
        this.days = [];
        this.allTasks = tasks.data;
        const mondayDate = this.getMondayOfCurrentWeek();

        for (let i = 0; i < 7; i++) {
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

          if (event) {
            event.target.complete();
          }
        }
      }
    });
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

}
