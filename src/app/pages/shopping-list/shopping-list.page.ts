import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild, effect } from '@angular/core';
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
import { ShoppingItem } from 'src/app/models/shopping-item.model';
import { AlertService } from 'src/app/services/alert.service';
import { ShoppingService } from 'src/app/services/shopping.service';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.page.html',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    LucideAngularModule,
    PopupComponent,
    Navbar,
    PrimaryButton,
    TranslocoModule
  ],
})
export class ShoppingListPage {
  readonly plusIcon = PlusIcon;
  readonly closeIcon = XIcon;
  readonly alldoneIcon = CheckCheckIcon;
  readonly checkIcon = CheckIcon;

  @ViewChild('editorNameInput') editorNameInput?: ElementRef<HTMLInputElement>;

  editorIsOpen = false;
  itemToUpdate: ShoppingItem = null;

  isLoadingSave = false;
  isLoadingUpdate = false;
  isLoadingDelete = false;

  itemEditorForm = new FormGroup({
    createname: new FormControl<string | null>('', [
      Validators.minLength(1),
      Validators.required,
    ]),
  });

  itemUpdateEditorForm = new FormGroup({
    updatename: new FormControl<string | null>('', [
      Validators.minLength(1),
      Validators.required,
    ]),
  });

  openItems = this.shoppingService.openShoppingItems;
  doneItems = this.shoppingService.doneShoppingItems;

  constructor(
    private shoppingService: ShoppingService,
    private alertService: AlertService,
    private toastr: ToastrService
  ) {}

  get createNameField() {
    return this.itemEditorForm.get('createname');
  }

  get updateNameField() {
    return this.itemUpdateEditorForm.get('updatename');
  }

  openEditor(state: boolean) {
    this.itemEditorForm.controls.createname.setValue('');
    this.editorIsOpen = state;
      setTimeout(() => {
        this.editorNameInput?.nativeElement.focus();
      });

  }

  openUpdateEditor(item?: ShoppingItem) {
    if (item) {
      this.itemUpdateEditorForm.controls.updatename.setValue(item.name);
      this.itemToUpdate = item;
    } else {
      this.itemToUpdate = null;
    }
  }

  saveItem() {
    if (!this.createNameField.value) return;

    this.isLoadingSave = true;
    this.shoppingService
      .addShoppingItem(
        new ShoppingItem({
          id: undefined,
          name: this.createNameField.value,
          done: undefined,
        })
      )
      .subscribe((res) => {
        this.isLoadingSave = false;
        this.editorIsOpen = false;
        if (res.success) {
          this.toastr.success('Element wurde zur Einkaufsliste hinzugefügt');
        } else {
          this.toastr.error(res.error);
        }

        this.itemEditorForm.reset();
      });
  }

  updateDone(id: number, checked: boolean) {
    this.shoppingService
      .updateShoppingItem(
        new ShoppingItem({ id, name: undefined, done: checked })
      )
      .subscribe((res) => {
        if (res.success) {
          const message = checked
            ? 'Element wurde als erledigt markiert'
            : 'Element wurde als offen markiert';
          this.toastr.success(message);
        } else {
          this.toastr.error(res.error);
        }
      });
  }

  updateName(id: number) {
    if (!this.updateNameField.value) return;

    this.isLoadingUpdate = true;
    this.shoppingService
      .updateShoppingItem(
        new ShoppingItem({
          id,
          name: this.updateNameField.value,
          done: undefined,
        })
      )
      .subscribe((res) => {
        this.isLoadingUpdate = false;
        this.itemToUpdate = null;
        if (res.success) {
          this.toastr.success('Element wurde geupdated');
        } else {
          this.toastr.error(res.error);
        }

        this.itemUpdateEditorForm.reset();
      });
  }

  askToDeleteTask(id: number) {
    this.alertService.showAlert(
      'Löschen?',
      'Element löschen?',
      'Okay',
      () => this.deleteItem(id),
      'Cancel'
    );
  }

  deleteItem(id: number) {
    this.isLoadingDelete = true;
    this.shoppingService.deleteShoppingItem(id).subscribe((res) => {
      this.isLoadingDelete = false;
      if (res.success) {
        this.toastr.success('Todo wurde gelöscht');
        this.itemToUpdate = null;
      } else {
        this.toastr.error(res.error);
      }
    });
  }
}
