import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TranslocoModule } from '@jsverse/transloco';
import {
  CheckCheckIcon,
  CheckIcon,
  LucideAngularModule,
  PlusIcon,
  XIcon,
} from 'lucide-angular';
import { ToastrService } from 'ngx-toastr';
import { Navbar } from 'src/app/components/navbar/navbar';
import { PopupComponent } from 'src/app/components/popup/popup.component';
import { PrimaryButton } from 'src/app/components/primary-button/primary-button';
import { Todo } from 'src/app/models/todo.model';
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
    PrimaryButton,
    PopupComponent,
    Navbar,
    TimeAgoPipe,
    TranslocoModule
  ],
})
export class Todos {
  readonly plusIcon = PlusIcon;
  readonly closeIcon = XIcon;
  readonly alldoneIcon = CheckCheckIcon;
  readonly checkIcon = CheckIcon;

  editorIsOpen = false;
  todoToUpdate = signal<Todo | null>(null);

  itemEditorForm = new FormGroup({
    createname: new FormControl<string | null>('', [
      Validators.minLength(1),
      Validators.maxLength(100),
      Validators.required,
    ]),
    createdescription: new FormControl<string | null>('', [
      Validators.maxLength(500),
    ]),
  });

  itemUpdateEditorForm = new FormGroup({
    updatename: new FormControl<string | null>('', [
      Validators.minLength(1),
      Validators.maxLength(100),
      Validators.required,
    ]),
    updatedescription: new FormControl<string | null>('', [
      Validators.maxLength(500),
    ]),
  });

  openTodos = this.todosService.openTodos;
  doneTodos = this.todosService.doneTodos;
  isLoadingTodos = false;
  isLoadingSave = signal(false);
  isLoadingUpdate = signal(false);
  isLoadingDelete = signal(false);

  constructor(
    private todosService: TodosService,
    private alertService: AlertService,
    private toastr: ToastrService
  ) {}

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

  openEditor(state: boolean) {
    this.itemEditorForm.reset();
    this.editorIsOpen = state;
  }

  openUpdateEditor(item?: Todo) {
    if (item) {
      this.itemUpdateEditorForm.patchValue({
        updatename: item.name,
        updatedescription: item.description,
      });
      this.todoToUpdate.set(item);
    } else {
      this.todoToUpdate.set(null);
    }
  }

  saveItem() {
    if (this.createNameField?.value) {
      this.isLoadingSave.set(true);
      this.todosService
        .createTodo(
          this.createNameField.value,
          this.createDescriptionField?.value
        )
        .subscribe((res) => {
          this.isLoadingSave.set(false);
          this.editorIsOpen = false;
          if (res.success) {
            this.toastr.success('Todo wurde erstellt');
          } else {
            this.toastr.error(res.error);
          }
          this.itemEditorForm.reset();
        });
    }
  }

  updateDone(id: number, done: boolean) {
    this.todosService
      .updateTodo(
        new Todo({
          id,
          name: undefined,
          description: undefined,
          done,
          doneDate: undefined,
          creator: undefined,
        })
      )
      .subscribe((res) => {
        if (res.success) {
          this.toastr.success(
            done
              ? 'Todo wurde als erledigt markiert'
              : 'Todo wurde als offen markiert'
          );
        } else {
          this.toastr.error(res.error);
        }
      });
  }

  updateName(id: number) {
    if (this.updateNameField?.value) {
      this.isLoadingUpdate.set(true);
      this.todosService
        .updateTodo(
          new Todo({
            id,
            name: this.updateNameField.value,
            description: this.updateDescriptionField.value,
            done: undefined,
            doneDate: undefined,
            creator: undefined,
          })
        )
        .subscribe((res) => {
          this.isLoadingUpdate.set(false);
          this.todoToUpdate.set(null);
          if (res.success) {
            this.toastr.success('Todo wurde geupdated');
          } else {
            this.toastr.error(res.error);
          }
          this.itemUpdateEditorForm.reset();
        });
    }
  }

  askToDeleteTask(id: number) {
    this.alertService.showAlert(
      'Löschen?',
      'Todo löschen?',
      'Okay',
      () => this.deleteTodo(id),
      'Cancel'
    );
  }

  deleteTodo(id: number) {
    this.isLoadingDelete.set(true);
    this.todosService.deleteTodo(id).subscribe((res) => {
      this.isLoadingDelete.set(false);
      if (res.success) {
        this.toastr.success('Todo wurde gelöscht');
        this.todoToUpdate.set(null);
      } else {
        this.toastr.error(res.error);
      }
    });
  }

  shortenDescription(description: string): string {
    const splitted = description.split('\n');
    return splitted.length > 2 ? splitted[0] + '\n' + splitted[1] : description;
  }
}
