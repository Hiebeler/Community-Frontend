import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  CheckCheckIcon,
  CheckIcon,
  LucideAngularModule,
  PlusIcon,
  XIcon,
} from 'lucide-angular';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { Navbar } from 'src/app/components/navbar/navbar';
import { PopupComponent } from 'src/app/components/popup/popup.component';
import { Todo } from 'src/app/models/todo';
import { TimeAgoPipe } from 'src/app/pipes/time-ago.pipe';
import { AlertService } from 'src/app/services/alert.service';
import { TodosService } from 'src/app/services/todos.service';

@Component({
  selector: 'app-todos',
  templateUrl: './todos.html',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    LucideAngularModule,
    PopupComponent,
    Navbar,
    TimeAgoPipe,
  ],
})
export class Todos implements OnInit, OnDestroy {
  readonly plusIcon = PlusIcon;
  readonly closeIcon = XIcon;
  readonly alldoneIcon = CheckCheckIcon;
  readonly checkIcon = CheckIcon;

  subscriptions: Subscription[] = [];

  editorIsOpen = false;
  todoToUpdate: Todo = null;

  completedFirstLoad = false;

  itemEditorForm: FormGroup;
  itemUpdateEditorForm: FormGroup;

  openTodos: Todo[] = [];
  doneTodos: Todo[] = [];

  constructor(
    private todosService: TodosService,
    private alertService: AlertService,
    private toastr: ToastrService
  ) {
    this.itemEditorForm = new FormGroup({
      createname: new FormControl<string | null>('', [
        Validators.minLength(1),
        Validators.maxLength(100),
        Validators.required,
      ]),
      createdescription: new FormControl<string | null>('', [
        Validators.maxLength(500),
      ]),
    });

    this.itemUpdateEditorForm = new FormGroup({
      updatename: new FormControl<string | null>('', [
        Validators.minLength(1),
        Validators.maxLength(100),
        Validators.required,
      ]),
      updatedescription: new FormControl<string | null>('', [
        Validators.maxLength(500),
      ]),
    });
  }

  get createNameField() {
    return this.itemEditorForm.get('createname');
  }

  get createDescriptionField() {
    return this.itemEditorForm.get('createdescription');
  }

  get updateNameField() {
    return this.itemUpdateEditorForm.get('updatename');
  }

  get updateDescriptionField() {
    return this.itemUpdateEditorForm.get('updatedescription');
  }

  ngOnInit() {
    this.getItems();

    this.subscriptions.push(
      this.todosService.getOpenTodos().subscribe((items) => {
        this.openTodos = items;

        this.completedFirstLoad = true;
      })
    );

    this.subscriptions.push(
      this.todosService.getDoneTodos().subscribe((items) => {
        this.doneTodos = items;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  openEditor(state: boolean) {
    this.itemEditorForm.controls.createname.setValue('');
    this.editorIsOpen = state;
  }

  openUpdateEditor(item?: Todo) {
    if (item) {
      this.itemUpdateEditorForm.controls.updatename.setValue(item.name);
      this.itemUpdateEditorForm.controls.updatedescription.setValue(
        item.description
      );
      this.todoToUpdate = item;
    } else {
      this.todoToUpdate = null;
    }
  }

  getItems() {
    this.todosService.fetchTodosFromApi();
  }

  saveItem() {
    if (this.createNameField.value) {
      this.editorIsOpen = false;
      this.subscriptions.push(
        this.todosService
          .createTodo(
            this.createNameField.value,
            this.createDescriptionField.value
          )
          .subscribe((res) => {
            if (res.status === 'OK') {
              this.toastr.success('Todo wurde erstellt');
              this.getItems();
            } else {
              this.toastr.error('Ein Fehler ist aufgetreten');
            }
          })
      );
      this.itemEditorForm.controls.createname.setValue('');
      this.itemEditorForm.controls.createdescription.setValue('');
    }
  }

  updateDone(id: number, done: boolean) {
    this.subscriptions.push(
      this.todosService
        .updateTodo(
          new Todo(id, undefined, undefined, done, undefined, undefined)
        )
        .subscribe((res) => {
          if (res.status === 'OK') {
            this.getItems();
            if (done) {
              this.toastr.success('Todo wurde als erledigt markiert');
            } else {
              this.toastr.success('Todo wurde als offen markiert');
            }
          } else {
            this.toastr.error('Ein Fehler ist aufgetreten');
          }
        })
    );
  }

  updateName(id: number) {
    if (this.updateNameField.value) {
      this.todoToUpdate = null;

      this.subscriptions.push(
        this.todosService
          .updateTodo(
            new Todo(
              id,
              this.updateNameField.value,
              this.updateDescriptionField.value,
              undefined,
              undefined,
              undefined
            )
          )
          .subscribe((res) => {
            if (res.status === 'OK') {
              this.toastr.success('Todo wurde geupdated');
              this.getItems();
            } else {
              this.toastr.error('Ein Fehler ist aufgetreten');
            }
          })
      );
      this.itemUpdateEditorForm.controls.updatename.setValue('');
      this.itemUpdateEditorForm.controls.updatedescription.setValue('');
    }
  }

  askToDeleteTask(id: number) {
    this.alertService.showAlert(
      'Löschen?',
      'Todo löschen?',
      'Okay',
      () => {
        this.deleteTodo(id);
      },
      'Cancel'
    );
  }

  deleteTodo(id: number) {
    this.subscriptions.push(
      this.todosService.deleteTodo(id).subscribe((res) => {
        if (res.status === 'OK') {
          this.toastr.success('Todo wurde gelöscht');
          this.getItems();
          this.todoToUpdate = null;
        } else {
          this.toastr.error('Ein Fehler ist aufgetreten');
        }
      })
    );
  }

  shortenDescription(description: string): string {
    const splittedDescription = description.split('\n')
    if (splittedDescription.length > 1) {
      return splittedDescription[0] + '\n...'
    }
    return description;
  }
}
