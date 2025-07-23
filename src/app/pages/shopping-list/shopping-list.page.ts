import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LucideAngularModule, PlusIcon, XIcon } from 'lucide-angular';
import { Subscription } from 'rxjs';
import { PopupComponent } from 'src/app/components/popup/popup.component';
import { ShoppingItem } from 'src/app/models/shopping-item';
import { ShoppingService } from 'src/app/services/shopping.service';

@Component({
    selector: 'app-shopping-list',
    templateUrl: './shopping-list.page.html',
    imports: [
      CommonModule,
      ReactiveFormsModule,
      LucideAngularModule,
      PopupComponent
    ]
})
export class ShoppingListPage implements OnInit, OnDestroy {
  readonly plusIcon = PlusIcon;
  readonly closeIcon = XIcon;

  subscriptions: Subscription[] = [];

  editorIsOpen = false;
  itemToUpdate: ShoppingItem = null;

  completedFirstLoad = false;

  itemEditorForm: FormGroup;
  itemUpdateEditorForm: FormGroup;

  openItems: ShoppingItem[] = [];
  doneItems: ShoppingItem[] = [];

  loadingEvent: any;

  constructor(
    private shoppingService: ShoppingService
  ) {
    this.itemEditorForm = new FormGroup({
      createname: new FormControl<string | null>('', [Validators.minLength(1), Validators.required])
    });

    this.itemUpdateEditorForm = new FormGroup({
      updatename: new FormControl<string | null>('', [Validators.minLength(1), Validators.required])
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

    this.subscriptions.push(this.shoppingService.getOpenShoppingItems().subscribe((items) => {
      this.openItems = items;

      this.completedFirstLoad = true;

      if (this.loadingEvent) {
        this.loadingEvent.target.complete();
      }
    }));

    this.subscriptions.push(this.shoppingService.getDoneShoppingItems().subscribe((items) => {
      this.doneItems = items;

      if (this.loadingEvent) {
        this.loadingEvent.target.complete();
      }
    }));
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

  getItems(event?) {
    if (event) {
      this.loadingEvent = event;
    }
    this.shoppingService.fetchShoppingItemsFromApi();
  }

  saveItem() {
    if (this.createNameField.value) {
      this.editorIsOpen = false;
      this.subscriptions.push(
        this.shoppingService.addShoppingItem(new ShoppingItem(null, this.createNameField.value, null)).subscribe((res) => {
          this.getItems();
        })
      );
      this.itemEditorForm.controls.createname.setValue('');
    }
  }

  updateDone(id: number, e: any) {
    this.subscriptions.push(
      this.shoppingService.updateShoppingItem(new ShoppingItem(id, null, e.target.checked)).subscribe((res) => {
        if (res.status === 'OK') {
          this.getItems();
        }
      })
    );
  }

  updateName(id: number) {
    if (this.updateNameField.value) {
      this.itemToUpdate = null;
      const data = {
        id,
        name: this.updateNameField.value
      };


      this.subscriptions.push(
        this.shoppingService.updateShoppingItem(new ShoppingItem(id, this.updateNameField.value, undefined)).subscribe((res) => {
          if (res.status === 'OK') {
            this.getItems();
          }
        })
      );
      this.itemUpdateEditorForm.controls.updatename.setValue('');
    }
  }
}
