import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { filter, Subscription } from 'rxjs';
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
export class DebtsPage implements OnInit, OnDestroy {

  subscriptions: Subscription[] = [];

  editorIsOpen = false;

  clearOffEditorIsOpenId = -1;

  itemEditorForm: FormGroup;
  clearOffBalanceEditorForm: FormGroup;

  loadingEvent: any;

  usersInCommunity: User[] = [];

  allBalances: Balance[] = [];
  positiveBalances: Balance[] = [];
  negativeBalances: Balance[] = [];

  iOwe = false;

  currentUser: User;

  constructor(
    private debtService: DebtService,
    private userService: UserService,
    private router: Router
  ) {
    this.itemEditorForm = new FormGroup({
      debitor: new FormControl<string | null>('', [Validators.minLength(1), Validators.required]),
      amount: new FormControl<string | null>('', [Validators.pattern(/^[0-9]*((\.|,)[0-9]{0,2})?$/), Validators.required]),
      name: new FormControl<string | null>('', [Validators.minLength(1), Validators.required])
    });

    this.clearOffBalanceEditorForm = new FormGroup({
      amount: new FormControl<string | null>('', [Validators.pattern(/^[0-9]{0,2}(\.\d{1,2})?/), Validators.required]),
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

    this.subscriptions.push(this.debtService.getBalance().subscribe((balances) => {
      this.allBalances = balances;
      console.log(this.allBalances);
      this.positiveBalances = balances.filter(balance => balance.amount > 0);
      this.negativeBalances = balances.filter(balance => balance.amount < 0);

      if (this.loadingEvent) {
        this.loadingEvent.target.complete();
      }
    }));

    this.subscriptions.push(this.userService.getCurrentUser().subscribe((user) => {
      this.currentUser = user;

      this.filterCurrentUser();

      if (this.loadingEvent) {
        this.loadingEvent.target.complete();
      }
    }));

    this.subscriptions.push(this.userService.getUsersInCurrentCommunity().subscribe(users => {
      this.usersInCommunity = users;
      this.filterCurrentUser();
    }));
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  filterCurrentUser() {
    if (this.currentUser && this.usersInCommunity.length) {
      this.usersInCommunity = this.usersInCommunity.filter(user => user.id !== this.currentUser.id);
    }
  }

  openEditor(state: boolean) {
    this.editorIsOpen = state;
  }

  openClearOffEditor(item?: Balance) {
    if (item) {
      this.clearOffBalanceEditorForm.controls.amount.setValue(item.amount < 0 ? item.amount * -1 : item.amount);
      this.clearOffEditorIsOpenId = item.debitor.id;
    } else {
      this.clearOffEditorIsOpenId = -1;
    }
  }

  getItems(event?) {
    if (event) {
      this.loadingEvent = event;
    }
    this.debtService.fetchDebtsAndBalanceFromApi();
  }

  clearOffBalance(balance: Balance) {
    this.clearOffEditorIsOpenId = -1;
    let debt: Debt;
    if (balance.amount < 0) {
      debt = new Debt(-1, 'debt ausgeglichen', this.clearOffBalanceEditorForm.controls.amount.value, balance.debitor, this.currentUser);
    } else {
      debt = new Debt(-1, 'debt ausgeglichen', this.clearOffBalanceEditorForm.controls.amount.value, this.currentUser, balance.debitor);
    }

    this.subscriptions.push(this.debtService.addDebt(debt).subscribe((res) => {
      this.getItems();
    }));
  }

  saveDebt() {
    this.editorIsOpen = false;
    let debt: Debt;
    if (this.iOwe) {
      debt = new Debt(-1, this.nameControl.value, this.amountControl.value, this.debitorControl.value, this.currentUser);
    } else {
      debt = new Debt(-1, this.nameControl.value, this.amountControl.value, this.currentUser, this.debitorControl.value);
    }

    this.subscriptions.push(this.debtService.addDebt(debt).subscribe((res) => {
      this.getItems();
    }));
  }

  changeIOwe(iOwe: boolean) {
    this.iOwe = iOwe;
  }

  gotoHistory() {
    this.router.navigate(['tabs/debts/history']);
  }

}
