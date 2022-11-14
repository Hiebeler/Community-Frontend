import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { Task } from 'src/app/models/task';
import { AlertService } from 'src/app/services/alert.service';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-task',
  templateUrl: './task.page.html',
  styleUrls: ['./task.page.scss'],
})
export class TaskPage implements OnInit {

  taskForm: FormGroup;

  task: Task;
  taskDone = false;

  getTasks;

  constructor(
    private modalController: ModalController,
    private apiService: ApiService,
    private alertService: AlertService
  ) {
    this.taskForm = new FormGroup({
      name: new FormControl<string | null>('', [Validators.minLength(1), Validators.required]),
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

  toggleChanged(event: any) {
    this.taskDone = event.target.checked;
  }

  async closeModal() {
    if (this.name.valid) {
      const data: any = { id: this.task.id };
      let changed = false;

      if (this.name.value !== this.task.name) {
        data.name = this.name.value;
        changed = true;
      }

      if (this.notes.value !== this.task.notes) {
        data.notes = this.notes.value;
        changed = true;
      }

      if (this.taskDone !== this.task.done) {
        data.done = this.taskDone;
        changed = true;
      }

      if (!this.task.id) {
        data.name = this.name.value;
        data.fk_routine_id = this.task.fkRoutineId;
        data.date = this.task.date;
        changed = true;
      }

      if (changed) {
        this.apiService.updateTask(data).subscribe(() => {
          this.getTasks();
        });
      }
    }

    await this.modalController.dismiss();
  }

  updateTask() {
    const data = {
      id: this.task.id,
      name: this.name.value,
      notes: this.notes.value,
      date: this.task.date,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      fk_routine_id: this.task.fkRoutineId
    };
    this.apiService.updateTask(data).subscribe((result) => {
      console.log(result);
    });
  }

  askToDeleteTask() {
    this.alertService.showTwoButtonAlert(
      'Löschen?',
      'Aufgabe löschen?',
      this.deleteTask.bind(this)
    );
  }

  deleteTask() {
    this.apiService.deleteTask(this.task.id).subscribe(() => {
      this.getTasks();
      this.modalController.dismiss();
    });
  }
}
