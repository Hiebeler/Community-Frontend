import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { Task } from 'src/app/models/task';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-task',
  templateUrl: './task.page.html',
  styleUrls: ['./task.page.scss'],
})
export class TaskPage implements OnInit {

  taskForm: FormGroup;

  task: Task;

  constructor(
    private modalController: ModalController,
    private apiService: ApiService
  ) {
    this.taskForm = new FormGroup({
      name: new FormControl<string | null>('', []),
      notes: new FormControl<string | null>('', [])
    });
  }

  get name() {
    return this.taskForm.get('name');
  }

  get notes() {
    return this.taskForm.get('notes');
  }

  ngOnInit(): void {
    this.name.setValue(this.task.name);
    this.notes.setValue(this.task.notes);
  }

  async closeModal() {
    await this.modalController.dismiss();
  }

  updateTask() {
    const data = {
      id: this.task.id,
      name: this.name.value,
      notes: this.notes.value,
      date: this.task.date
    };
    this.apiService.updateTask(data).subscribe((result) => {
      console.log(result);
    });
  }
}
