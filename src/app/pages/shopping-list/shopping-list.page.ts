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
  ],
})
export class ShoppingListPage implements OnInit, OnDestroy {
  readonly plusIcon = PlusIcon;
  readonly closeIcon = XIcon;
  readonly alldoneIcon = CheckCheckIcon;
  readonly checkIcon = CheckIcon;

  subscriptions: Subscription[] = [];

  editorIsOpen = false;
  itemToUpdate: ShoppingItem = null;

  completedFirstLoad = false;

  isLoadingSave = false;
  isLoadingUpdate = false;
  isLoadingDelete = false;

  itemEditorForm: FormGroup;
  itemUpdateEditorForm: FormGroup;

  openItems: ShoppingItem[] = [];
  doneItems: ShoppingItem[] = [];

  constructor(
    private shoppingService: ShoppingService,
    private alertService: AlertService,
    private toastr: ToastrService
  ) {
    this.itemEditorForm = new FormGroup({
      createname: new FormControl<string | null>('', [
        Validators.minLength(1),
        Validators.required,
      ]),
    });

    this.itemUpdateEditorForm = new FormGroup({
      updatename: new FormControl<string | null>('', [
        Validators.minLength(1),
        Validators.required,
      ]),
    });
  }

  get createNameField() {
    return this.itemEditorForm.get('createname');
  }

  get updateNameField() {
    return this.itemUpdateEditorForm.get('updatename');
  }

  ngOnInit() {
    this.getItems();

    this.subscriptions.push(
      this.shoppingService.getOpenShoppingItems().subscribe((items) => {
        this.openItems = items;

        this.completedFirstLoad = true;
      })
    );

    this.subscriptions.push(
      this.shoppingService.getDoneShoppingItems().subscribe((items) => {
        this.doneItems = items;
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

  openUpdateEditor(item?: ShoppingItem) {
    if (item) {
      this.itemUpdateEditorForm.controls.updatename.setValue(item.name);
      this.itemToUpdate = item;
    } else {
      this.itemToUpdate = null;
    }
  }

  getItems() {
    this.shoppingService.fetchShoppingItemsFromApi();
  }

  saveItem() {
    if (this.createNameField.value) {
      this.isLoadingSave = true;
      this.subscriptions.push(
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
              this.toastr.success(
                'Element wurde zur Einkaufsliste hinzugefügt'
              );
              this.getItems();
            } else {
              this.toastr.error(res.error);
            }
          })
      );
      this.itemEditorForm.controls.createname.setValue('');
    }
  }

  updateDone(id: number, checked: boolean) {
    this.subscriptions.push(
      this.shoppingService
        .updateShoppingItem(
          new ShoppingItem({ id, name: undefined, done: checked })
        )
        .subscribe((res) => {
          if (res.success) {
            if (checked) {
              this.toastr.success('Element wurde als erledigt markiert');
            } else {
              this.toastr.success('Element wurde als offen markiert');
            }
            this.getItems();
          } else {
            this.toastr.error(res.error);
          }
        })
    );
  }

  updateName(id: number) {
    if (this.updateNameField.value) {
      this.isLoadingUpdate = true;
      this.subscriptions.push(
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
              this.getItems();
            } else {
              this.toastr.error(res.error);
            }
          })
      );
      this.itemUpdateEditorForm.controls.updatename.setValue('');
    }
  }

  askToDeleteTask(id: number) {
    this.alertService.showAlert(
      'Löschen?',
      'Element löschen?',
      'Okay',
      () => {
        this.deleteItem(id);
      },
      'Cancel'
    );
  }

  deleteItem(id: number) {
    this.isLoadingDelete = true;
    this.subscriptions.push(
      this.shoppingService.deleteShoppingItem(id).subscribe(() => {
        this.isLoadingDelete = false;
        this.getItems();
        this.itemToUpdate = null;
      })
    );
  }
}
