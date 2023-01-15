import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Routine } from 'src/app/models/routine';
import { TaskService } from 'src/app/services/task.service';

@Component({
  selector: 'app-routine-editor',
  templateUrl: './routine-editor.component.html',
  styleUrls: ['./routine-editor.component.scss'],
})
export class RoutineEditorComponent implements OnInit {

  @Input() routine: Routine;
  @Output() closeEditor: EventEmitter<any> = new EventEmitter();

  routineForm: FormGroup;

  newRoutineEditorIsOpen = false;

  updateRoutineEditorOpenId = -1;

  constructor(
    private taskService: TaskService
  ) {
    this.routineForm = new FormGroup({
      name: new FormControl<string | null>('', [Validators.minLength(1), Validators.required]),
      notes: new FormControl<string | null>(''),
      startdate: new FormControl<string | null>('', [Validators.minLength(1), Validators.required]),
      interval: new FormControl<string | null>('', [Validators.pattern(/^[1-9][0-9]*$/), Validators.required]),
      done: new FormControl<string | null>('', [])
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
      this.startdateControl.setValue(this.routine.startDate.toISOString().split('T')[0]);
      this.intervalControl.setValue(this.routine.interval);
      this.doneControl.setValue(this.routine.active);
    }
  }

  saveRoutine() {
    const id = this.routine?.id ?? null;
    const startDate = new Date(this.startdateControl.value);
    const routine = new Routine(
      id,
      this.nameControl.value,
      this.notesControl.value,
      startDate,
      this.intervalControl.value,
      this.doneControl.value,
      null
    );
    this.taskService.modifyRoutine(routine).subscribe(res => {
      if (res.status === 'OK') {
        this.parentCloseEditor();
        this.routineForm.reset();
      }
    });
  }

  parentCloseEditor() {
    this.closeEditor.emit();
  }
}
