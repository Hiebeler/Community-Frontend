import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Balance } from 'src/app/models/balance';
import { Debt } from 'src/app/models/debt';
import { User } from 'src/app/models/user';
import { DebtService } from 'src/app/services/debt.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-debts',
  templateUrl: './debts.page.html',
  styleUrls: ['./debts.page.scss'],
})
export class DebtsPage implements OnInit {

  editorIsOpen = false;

  itemEditorForm: FormGroup;

  loadingEvent: any;

  usersInCommunity: User[] = [];

  balances: Balance[] = [];

  iOwe = false;

  currentUser: User;

  constructor(
    private debtService: DebtService,
    private userService: UserService
  ) {
    this.itemEditorForm = new FormGroup({
      debitor: new FormControl<string | null>('', [Validators.minLength(1), Validators.required]),
      amount: new FormControl<string | null>('', [Validators.pattern(/^[0-9]{0,2}(\.\d{1,2})?/), Validators.required]),
      name: new FormControl<string | null>('', [Validators.minLength(1), Validators.required])
    });

    this.userService.getUsersInCurrentCommunity().subscribe(users => {
      this.usersInCommunity = users;
    });
  }

  get debitorControl() {
    return this.itemEditorForm.get('debitor');
  }

  get amountControl() {
    return this.itemEditorForm.get('amount');
  }

  get nameControl() {
    return this.itemEditorForm.get('name');
  }

  ngOnInit() {
    this.getItems();

    this.debtService.getBalance().subscribe((balances) => {
      this.balances = balances;
    });
    this.userService.getCurrentUser().subscribe((user) => {
      this.currentUser = user;
    });
  }

  openEditor(state: boolean) {
    // this.itemEditorForm.controls.createname.setValue('');
    this.editorIsOpen = state;
  }

  getItems(event?) {
    if (event) {
      this.loadingEvent = event;
    }
    this.debtService.fetchDebtsAndBalanceFromApi();
  }

  clearOffBalance(balance: Balance) {
    let debt: Debt;
    if (balance.amount < 0) {
      debt = new Debt(-1, 'debt ausgeglichen', balance.amount, balance.debitor, this.currentUser);
    } else {
      debt = new Debt(-1, 'debt ausgeglichen', balance.amount, this.currentUser, balance.debitor);
    }
    this.debtService.addDebt(debt).subscribe((res) => {
      this.getItems();
    });
  }

  saveDebt() {
    this.editorIsOpen = false;
    let debt: Debt;
    if (this.iOwe) {
      debt = new Debt(-1, this.nameControl.value, this.amountControl.value, this.debitorControl.value, this.currentUser);
    } else {
      debt = new Debt(-1, this.nameControl.value, this.amountControl.value, this.currentUser, this.debitorControl.value);
    }
    this.debtService.addDebt(debt).subscribe((res) => {
      this.getItems();
    });
  }

  changeIOwe(iOwe: boolean) {
    this.iOwe = iOwe;
  }

}
