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

  itemEditorForm: FormGroup;

  openItems: ShoppingItem[] = [];
  doneItems: ShoppingItem[] = [];

  constructor(
    private apiService: ApiService
  ) {
    this.itemEditorForm = new FormGroup({
      name: new FormControl<string | null>('', [Validators.minLength(1), Validators.required])
    });
  }

  get name() {
    return this.itemEditorForm.get('name');
  }

  ngOnInit() {
    this.apiService.getOpenShoppingItems().subscribe((items) => {
      this.openItems = items;
      console.log(items);
      this.openItems = items;
    });
  }

  openEditor(state: boolean) {
    this.itemEditorForm.controls.name.setValue('');
    this.editorIsOpen = state;
  }

  getOpenItems(event?) {
    this.apiService.getOpenShoppingItems().subscribe((items) => {
      this.openItems = items;
      console.log(items);
      this.openItems = items;

      if (event) {
        event.target.complete();
      }
    });
  }

  saveItem() {
    if (this.name.value) {
      this.editorIsOpen = false;
      this.apiService.addShoppingItem({ name: this.name.value }).subscribe((res) => {
        this.getOpenItems();
      });
      this.itemEditorForm.controls.name.setValue('');
    }
  }

}
