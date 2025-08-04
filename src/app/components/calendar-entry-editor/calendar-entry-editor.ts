import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { CalendarEntry } from 'src/app/models/calendarEntry';
import { User } from 'src/app/models/user';
import { AlertService } from 'src/app/services/alert.service';
import { CalendarService } from 'src/app/services/calendar.service';

@Component({
  selector: 'app-calendar-entry-editor',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './calendar-entry-editor.html',
})
export class CalendarEntryEditor implements OnInit {
  @Input() calendarEntry?: CalendarEntry;
  @Input() date?: Date;
  @Output() closeEditor: EventEmitter<any> = new EventEmitter();

  calendarEntryForm: FormGroup;

  subscriptions: Subscription[] = [];

  taskDone = false;

  updatingResponsibleUsers = false;

  assignableUsers: User[] = [];
  assignedUsers: User[] = [];

  constructor(
    private calendarService: CalendarService,
    private alertService: AlertService,
    private toastrService: ToastrService
  ) {
    this.calendarEntryForm = new FormGroup({
      name: new FormControl<string | null>('', [
        Validators.minLength(1),
        Validators.required,
      ]),
      notes: new FormControl<string | null>('', []),
    });
  }
  ngOnInit(): void {
    if (this.calendarEntry != null) {
      this.calendarEntryForm.controls.name.setValue(this.calendarEntry.name);
    }
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
    this.subscriptions.push(
      this.calendarService
        .createCalendarEntry({
          name: this.name.value,
          date: this.date.toISOString(),
        })
        .subscribe((res) => {
          if (res.status === 'OK') {
            this.toastrService.success('Kalendereintrag erstellt');
            this.closeEditor.emit();
          } else {
            this.toastrService.error('Ein Fehler ist aufgetreten');
          }
        })
    );
  }

  updateCalendarEntry() {}

  deleteCalendarEntry() {
    this.subscriptions.push(
      this.calendarService
        .deleteCalendarEntry(this.calendarEntry.id)
        .subscribe((res) => {
          if (res.status === 'OK') {
            this.toastrService.success('Eintrag gelöscht');
            this.closeEditor.emit();
          } else {
            this.toastrService.error('Fehler beim löschen');
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
