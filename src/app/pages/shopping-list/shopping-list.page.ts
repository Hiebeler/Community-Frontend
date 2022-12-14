import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ShoppingItem } from 'src/app/models/shopping-item';
import { ShoppingService } from 'src/app/services/shopping.service';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.page.html',
  styleUrls: ['./shopping-list.page.scss'],
})
export class ShoppingListPage implements OnInit {

  editorIsOpen = false;
  editorIsOpenId = -1;

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

    this.shoppingService.getOpenShoppingItems().subscribe((items) => {
      this.openItems = items;

      this.completedFirstLoad = true;

      if (this.loadingEvent) {
        this.loadingEvent.target.complete();
      }
    });

    this.shoppingService.getDoneShoppingItems().subscribe((items) => {
      this.doneItems = items;

      if (this.loadingEvent) {
        this.loadingEvent.target.complete();
      }
    });
  }

  openEditor(state: boolean) {
    this.itemEditorForm.controls.createname.setValue('');
    this.editorIsOpen = state;
  }

  openUpdateEditor(item?: ShoppingItem) {
    if (item) {
      this.itemUpdateEditorForm.controls.updatename.setValue(item.name);
    this.editorIsOpenId = item.id;
    } else {
      this.editorIsOpenId = -1;
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
      this.shoppingService.addShoppingItem(this.createNameField.value).subscribe((res) => {
        this.getItems();
      });
      this.itemEditorForm.controls.createname.setValue('');
    }
  }

  updateDone(id: number, e: any) {
    this.shoppingService.updateShoppingItem(id, e.target.checked).subscribe((res) => {
      if (res.status === 'OK') {
        this.getItems();
      }
    });
  }

  updateName(id: number) {
    if (this.updateNameField.value) {
      this.editorIsOpenId = -1;
      const data = {
        id,
        name: this.updateNameField.value
      };

      this.shoppingService.updateShoppingItem(id, undefined, this.updateNameField.value).subscribe((res) => {
        if (res.status === 'OK') {
          this.getItems();
        }
      });
      this.itemUpdateEditorForm.controls.updatename.setValue('');
    }
  }
}
