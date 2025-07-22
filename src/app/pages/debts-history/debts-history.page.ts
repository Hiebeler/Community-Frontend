import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Debt } from 'src/app/models/debt';
import { User } from 'src/app/models/user';
import { DebtService } from 'src/app/services/debt.service';

@Component({
    selector: 'app-debts-history',
    templateUrl: './debts-history.page.html',
    styleUrls: ['./debts-history.page.scss'],
    standalone: true,
    imports: [
      IonicModule,
      CommonModule
    ]
})
export class DebtsHistoryPage implements OnInit {

  subscriptions: Subscription[] = [];

  loadingEvent: any;


  debts: Debt[] = [];

  currentUser: User;

  constructor(
    private router: Router,
    private debtService: DebtService
  ) { }

  ngOnInit() {

    this.getItems();

    this.subscriptions.push(this.debtService.getMyDebts().subscribe((debts) => {
      this.debts = debts;

      if (this.loadingEvent) {
        this.loadingEvent.target.complete();
      }
    }));
  }

  getItems(event?) {
    if (event) {
      this.loadingEvent = event;
    }
    this.debtService.fetchDebtsAndBalanceFromApi();
  }

  gotoDebts() {
    this.router.navigate(['debts']);
  }

}
