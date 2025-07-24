import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  ArrowDownIcon,
  ArrowLeftIcon,
  LucideAngularModule,
  TrendingDownIcon,
  TrendingUpIcon,
} from 'lucide-angular';
import { Subscription } from 'rxjs';
import { Navbar } from 'src/app/components/navbar/navbar';
import { Debt } from 'src/app/models/debt';
import { User } from 'src/app/models/user';
import { DebtService } from 'src/app/services/debt.service';

@Component({
  selector: 'app-debts-history',
  templateUrl: './debts-history.page.html',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, Navbar],
})
export class DebtsHistoryPage implements OnInit {
  readonly backIcon = ArrowLeftIcon;
  readonly stonksIcon = TrendingUpIcon;
  readonly stinksIcon = TrendingDownIcon;
  readonly arrowDown = ArrowDownIcon;

  subscriptions: Subscription[] = [];

  loadingEvent: any;

  debts: Debt[] = [];

  currentUser: User;

  constructor(private router: Router, private debtService: DebtService) {}

  ngOnInit() {
    this.getItems();

    this.subscriptions.push(
      this.debtService.getMyDebts().subscribe((debts) => {
        this.debts = debts;

        if (this.loadingEvent) {
          this.loadingEvent.target.complete();
        }
      })
    );
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
