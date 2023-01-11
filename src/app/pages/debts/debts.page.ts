import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-debts',
  templateUrl: './debts.page.html',
  styleUrls: ['./debts.page.scss'],
})
export class DebtsPage implements OnInit {

  editorIsOpen = false;

  itemEditorForm: FormGroup;

  loadingEvent: any;

  constructor() { }

  ngOnInit() {
  }

  openEditor(state: boolean) {
    // this.itemEditorForm.controls.createname.setValue('');
    this.editorIsOpen = state;
  }

  getItems(event?) {
    if (event) {
      this.loadingEvent = event;
    }
    // this.shoppingService.fetchShoppingItemsFromApi();
  }

  saveItem() {
    // if (this.createNameField.value) {
    //   this.editorIsOpen = false;
    //   this.shoppingService.addShoppingItem(this.createNameField.value).subscribe((res) => {
    //     this.getItems();
    //   });
    //   this.itemEditorForm.controls.createname.setValue('');
    // }
  }

}
