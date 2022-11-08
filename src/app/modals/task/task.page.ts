import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Task } from 'src/app/models/task';

@Component({
  selector: 'app-task',
  templateUrl: './task.page.html',
  styleUrls: ['./task.page.scss'],
})
export class TaskPage {

  task: Task;

  constructor(
    private modalController: ModalController
  ) { }

  async closeModal() {
    await this.modalController.dismiss();
  }

}
