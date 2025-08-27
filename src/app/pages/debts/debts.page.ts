import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslocoModule } from '@jsverse/transloco';
import {
  CheckCheckIcon,
  HistoryIcon,
  LucideAngularModule,
  PlusIcon,
  ScaleIcon,
  XIcon,
} from 'lucide-angular';
import { Subscription } from 'rxjs';
import { Navbar } from 'src/app/components/navbar/navbar';
import { PopupComponent } from 'src/app/components/popup/popup.component';
import { Balance } from 'src/app/models/balance.model';
import { Debt } from 'src/app/models/debt.model';
import { User } from 'src/app/models/user.model';
import { CommunityService } from 'src/app/services/community.service';
import { DebtService } from 'src/app/services/debt.service';
import { UserService } from 'src/app/services/user.service';
@Component({
  selector: 'app-debts',
  templateUrl: './debts.page.html',
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    LucideAngularModule,
    PopupComponent,
    Navbar,
    TranslocoModule
  ],
})
export class DebtsPage implements OnInit, OnDestroy {
  readonly plusIcon = PlusIcon;
  readonly receiptIcon = HistoryIcon;
  readonly closeIcon = XIcon;
  readonly scaleIcon = ScaleIcon;
  readonly alldoneIcon = CheckCheckIcon;

  subscriptions: Subscription[] = [];

  editorIsOpen = false;

  clearOffEditorBalance: Balance = null;

  itemEditorForm: FormGroup;
  clearOffBalanceEditorForm: FormGroup;

  usersInCommunity = this.communityService.usersInActiveCommunity;

  allBalances: Balance[] = [];

  iOwe = false;

  currentUser = this.userService.user;

  constructor(
    private debtService: DebtService,
    private userService: UserService,
    private communityService: CommunityService
  ) {
    this.itemEditorForm = new FormGroup({
      debitor: new FormControl<string | null>('', [
        Validators.minLength(1),
        Validators.required,
      ]),
      amount: new FormControl<string | null>('', [
        Validators.pattern(/^[0-9]*((\.|,)[0-9]{0,2})?$/),
        Validators.required,
      ]),
      name: new FormControl<string | null>('', [
        Validators.minLength(1),
        Validators.required,
      ]),
    });

    this.clearOffBalanceEditorForm = new FormGroup({
      amount: new FormControl<string | null>('', [
        Validators.pattern(/^[0-9]{0,2}(\.\d{1,2})?/),
        Validators.required,
      ]),
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

    this.subscriptions.push(
      this.debtService.getBalance().subscribe((balances) => {
        this.allBalances = balances;
      })
    );


    const usersInCommunityAll = this.communityService.usersInActiveCommunity();
    console.log(usersInCommunityAll);
    //this.usersInCommunity = usersInCommunityAll.filter((user) => user.id !== this.currentUser?.id);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  filterCurrentUser() {
    /*if (this.currentUser && this.usersInCommunity.length) {
      this.usersInCommunity = this.usersInCommunity.filter(
        (user) => user.id !== this.currentUser.id
      );
    }*/
  }

  openEditor(state: boolean) {
    this.editorIsOpen = state;
  }

  openClearOffEditor(item?: Balance) {
    this.clearOffEditorBalance = item;
    if (item) {
      this.clearOffBalanceEditorForm.controls.amount.setValue(
        item.amount < 0 ? item.amount * -1 : item.amount
      );
    }
  }

  getItems() {
    this.debtService.fetchDebtsAndBalanceFromApi();
  }

  clearOffBalance(balance: Balance) {
    this.clearOffEditorBalance = null;
    let debt: Debt;
    if (balance.amount < 0) {
      debt = new Debt({
        id: undefined,
        name: 'debt ausgeglichen',
        amount: this.clearOffBalanceEditorForm.controls.amount.value,
        debitor: balance.debitor,
        creditor: this.currentUser(),
      });
    } else {
      debt = new Debt({
        id: undefined,
        name: 'debt ausgeglichen',
        amount: this.clearOffBalanceEditorForm.controls.amount.value,
        debitor: this.currentUser(),
        creditor: balance.debitor,
      });
    }

    this.subscriptions.push(
      this.debtService.addDebt(debt).subscribe((res) => {
        this.getItems();
      })
    );
  }

  saveDebt() {
    this.editorIsOpen = false;
    let debt: Debt;
    if (this.iOwe) {
      debt = new Debt({
        id: undefined,
        name: this.nameControl.value,
        amount: this.amountControl.value,
        debitor: this.debitorControl.value,
        creditor: this.currentUser(),
      });
    } else {
      debt = new Debt({
        id: undefined,
        name: this.nameControl.value,
        amount: this.amountControl.value,
        debitor: this.currentUser(),
        creditor: this.debitorControl.value,
      });
    }

    this.subscriptions.push(
      this.debtService.addDebt(debt).subscribe((res) => {
        this.getItems();
      })
    );
  }

  changeIOwe(iOwe: boolean) {
    this.iOwe = iOwe;
  }
}
