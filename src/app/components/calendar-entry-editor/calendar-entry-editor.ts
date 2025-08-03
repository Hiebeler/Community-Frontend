import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Subscription } from 'rxjs';
import { CalendarEntry } from 'src/app/models/calendarEntry';
import { User } from 'src/app/models/user';
import { AlertService } from 'src/app/services/alert.service';
import { TaskService } from 'src/app/services/task.service';

@Component({
  selector: 'app-calendar-entry-editor',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './calendar-entry-editor.html',
})
export class CalendarEntryEditor {
  @Input() calendarEntry?: CalendarEntry;
  @Input() date?: Date;

  calendarEntryForm: FormGroup;

  subscriptions: Subscription[] = [];

  taskDone = false;

  updatingResponsibleUsers = false;

  assignableUsers: User[] = [];
  assignedUsers: User[] = [];

  constructor(
    private taskService: TaskService,
    private alertService: AlertService
  ) {
    this.calendarEntryForm = new FormGroup({
      name: new FormControl<string | null>('', [
        Validators.minLength(1),
        Validators.required,
      ]),
      notes: new FormControl<string | null>('', []),
    });

    console.log(this.calendarEntry)
  }

  get name() {
    return this.calendarEntryForm.get('name');
  }

  get notes() {
    return this.calendarEntryForm.get('notes');
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  askToDeleteCalendarEntry() {
    this.alertService.showAlert(
      'Löschen?',
      'Eintrag löschen?',
      'Okay',
      this.deleteCalendarEntry.bind(this),
      'Cancel'
    );
  }

  createCalendarEntry() {

  }

  updateCalendarEntry() {

  }

  deleteCalendarEntry() {
    this.subscriptions.push(
      this.taskService.deleteTask(this.calendarEntry.id).subscribe((res) => {
        if(res.status === "OK") {

        }
      })
    );
  }

  addUser(user: User) {
    this.calendarEntry.assignedUsers.push(user);
    this.assignableUsers = this.assignableUsers.filter(
      (el) => el.id !== user.id
    );
  }

  removeUser(user: User) {
    this.assignableUsers.push(user);
    this.calendarEntry.assignedUsers = this.calendarEntry.assignedUsers.filter(
      (el) => el.id !== user.id
    );
  }
}
