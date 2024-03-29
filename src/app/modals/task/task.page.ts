import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Task } from 'src/app/models/task';
import { User } from 'src/app/models/user';
import { AlertService } from 'src/app/services/alert.service';
import { TaskService } from 'src/app/services/task.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-task',
  templateUrl: './task.page.html',
  styleUrls: ['./task.page.scss'],
})
export class TaskPage implements OnInit, OnDestroy {

  subscriptions: Subscription[] = [];

  taskForm: FormGroup;

  task: Task;
  taskDone = false;

  updatingResponsibleUsers = false;

  assignableUsers: User[] = [];
  assignedUsers: User[] = [];

  getTasks;

  constructor(
    private modalController: ModalController,
    private taskService: TaskService,
    private alertService: AlertService,
    private userService: UserService
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

    this.subscriptions.push(this.userService.getUsersInCurrentCommunity().subscribe((allUsersOfCommunity: User[]) => {
      this.assignableUsers = allUsersOfCommunity;
      this.task.assignedUsers.forEach(assignedUser => {
        this.assignableUsers = this.assignableUsers.filter(el => el.id !== assignedUser.id);
      });
    }));
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
    }

  toggleChanged(event: any) {
    this.taskDone = event.target.checked;
  }

  setUpdatingResponsibleUsers(newValue: boolean) {
    this.updatingResponsibleUsers = newValue;
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

      if (this.assignedUsers !== this.task.assignedUsers) {
        changed = true;
      }

      if (!this.task.id) {
        data.name = this.name.value;
        data.fk_routine_id = this.task.fkRoutineId;
        data.date = this.task.date;
      }

      const users = [];
      this.task.assignedUsers.forEach(user => {
        users.push(user.id);
      });

      data.assignedUser = users;

      if (changed) {
        this.subscriptions.push(this.taskService.updateTask(data).subscribe(() => {
          this.getTasks();
        }));
      }
    }

    await this.modalController.dismiss();
  }

  askToDeleteTask() {
    this.alertService.showAlert(
      'Löschen?',
      'Aufgabe löschen?',
      'Okay',
      this.deleteTask.bind(this),
      'Cancel'
    );
  }

  deleteTask() {
    this.subscriptions.push(this.taskService.deleteTask(this.task.id).subscribe(() => {
      this.getTasks();
      this.modalController.dismiss();
    }));
  }

  addUser(user: User) {
    this.task.assignedUsers.push(user);
    this.assignableUsers = this.assignableUsers.filter(el => el.id !== user.id);
  }

  removeUser(user: User) {
    this.assignableUsers.push(user);
    this.task.assignedUsers = this.task.assignedUsers.filter(el => el.id !== user.id);
  }
}
