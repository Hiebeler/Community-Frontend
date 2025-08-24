import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TranslocoModule } from '@jsverse/transloco';
import { LucideAngularModule, XIcon } from 'lucide-angular';
import { Subscription } from 'rxjs';
import { Routine } from 'src/app/models/routine.model';
import { User } from 'src/app/models/user.model';
import { CalendarService } from 'src/app/services/calendar.service';
import { CommunityService } from 'src/app/services/community.service';

@Component({
  selector: 'app-routine-editor',
  templateUrl: './routine-editor.component.html',
  imports: [CommonModule, ReactiveFormsModule, LucideAngularModule, TranslocoModule],
  standalone: true,
})
export class RoutineEditorComponent implements OnInit, OnDestroy {
  readonly closeIcon = XIcon;

  @Input() routine: Routine;
  @Output() closeEditor: EventEmitter<any> = new EventEmitter();

  subscriptions: Subscription[] = [];

  routineForm: FormGroup;

  newRoutineEditorIsOpen = false;

  updatingResponsibleUsers = false;

  assignableUsers: User[] = [];
  assignedUsers: User[] = [];

  updateRoutineEditorOpenId = -1;

  constructor(
    private calendarService: CalendarService,
    private communityService: CommunityService
  ) {
    this.routineForm = new FormGroup({
      name: new FormControl<string | null>('', [
        Validators.minLength(1),
        Validators.required,
      ]),
      notes: new FormControl<string | null>(''),
      startdate: new FormControl<string | null>('', [
        Validators.minLength(1),
        Validators.required,
      ]),
      interval: new FormControl<string | null>('', [
        Validators.pattern(/^[1-9][0-9]*$/),
        Validators.required,
      ]),
      done: new FormControl<string | null>('', []),
    });
  }

  get nameControl() {
    return this.routineForm.get('name');
  }

  get notesControl() {
    return this.routineForm.get('notes');
  }

  get startdateControl() {
    return this.routineForm.get('startdate');
  }

  get intervalControl() {
    return this.routineForm.get('interval');
  }

  get doneControl() {
    return this.routineForm.get('done');
  }

  ngOnInit() {
    if (this.routine) {
      this.nameControl.setValue(this.routine.name);
      this.notesControl.setValue(this.routine.notes);
      this.startdateControl.setValue(
        this.routine.startDate.toISOString().split('T')[0]
      );
      this.intervalControl.setValue(this.routine.interval);
      this.doneControl.setValue(this.routine.active);
    }

    /* this.subscriptions.push(
      this.communityService
        .getUsersInCurrentCommunity()
        .subscribe((allUsersOfCommunity: User[]) => {
          this.assignableUsers = allUsersOfCommunity;
          if (this.routine) {
            this.assignedUsers = this.routine.assignedUsers;
          }

          this.assignedUsers.forEach((assignedUser) => {
            this.assignableUsers = this.assignableUsers.filter(
              (el) => el.id !== assignedUser.id
            );
          });
        })
    ); */
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  setUpdatingResponsibleUsers(newValue: boolean) {
    this.updatingResponsibleUsers = newValue;
  }

  saveRoutine() {
    const id = this.routine?.id ?? null;
    const startDate = new Date(this.startdateControl.value);
    const routine = new Routine({
      id,
      name: this.nameControl.value,
      notes: this.notesControl.value,
      startDate,
      interval: this.intervalControl.value,
      active: this.doneControl.value,
      assignedUsers: this.assignedUsers,
    });
    this.subscriptions.push(
      this.calendarService.modifyRoutine(routine).subscribe((res) => {
        if (res.success) {
          this.parentCloseEditor();
          this.routineForm.reset();
          this.calendarService.fetchRoutinesFromApi();
        }
      })
    );
  }

  addUser(user: User) {
    this.assignedUsers.push(user);
    this.assignableUsers = this.assignableUsers.filter(
      (el) => el.id !== user.id
    );
  }

  removeUser(user: User) {
    this.assignableUsers.push(user);
    this.assignedUsers = this.assignedUsers.filter((el) => el.id !== user.id);
  }

  parentCloseEditor() {
    this.closeEditor.emit();
  }
}
