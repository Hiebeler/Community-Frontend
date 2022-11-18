import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ShoppingItem } from 'src/app/models/shopping-item';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.page.html',
  styleUrls: ['./shopping-list.page.scss'],
})
export class ShoppingListPage implements OnInit {

  editorIsOpen = false;
  editorIsOpenId = -1;

  itemEditorForm: FormGroup;
  itemUpdateEditorForm: FormGroup;

  openItems: ShoppingItem[] = [];
  doneItems: ShoppingItem[] = [];

  constructor(
    private apiService: ApiService
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
    let otherFinished = false;

    this.apiService.getOpenShoppingItems().subscribe((items) => {
      this.openItems = items;

      if (event && otherFinished) {
        event.target.complete();
      } else {
        otherFinished = true;
      }
    });

    this.apiService.getDoneShoppingItems().subscribe((items) => {
      this.doneItems = items;

      if (event && otherFinished) {
        event.target.complete();
      } else {
        otherFinished = true;
      }
    });
  }

  saveItem() {
    if (this.createNameField.value) {
      this.editorIsOpen = false;
      this.apiService.addShoppingItem({ name: this.createNameField.value }).subscribe((res) => {
        this.getItems();
      });
      this.itemEditorForm.controls.createname.setValue('');
    }
  }

  updateDone(id: number, e: any) {
    console.log(e.target.checked);

    const data = {
      id,
      done: e.target.checked
    };

    this.apiService.updateShoppingItem(data).subscribe((res) => {
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

      this.apiService.updateShoppingItem(data).subscribe((res) => {
        if (res.status === 'OK') {
          this.getItems();
        }
      });
      this.itemUpdateEditorForm.controls.updatename.setValue('');
    }
  }
}
