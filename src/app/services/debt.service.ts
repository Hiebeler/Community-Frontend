import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { Debt } from '../models/debt';
import { ApiService } from './api.service';
import { Balance } from '../models/balance';

@Injectable({
  providedIn: 'root'
})
export class DebtService implements OnDestroy{

  subscriptions: Subscription[] = [];
  private balances = new BehaviorSubject<Balance[]>([]);
  private debts = new BehaviorSubject<Debt[]>([]);
  constructor(
    private apiService: ApiService
  ) { }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  addDebt(debt: Debt): Observable<any> {
    return this.apiService.addDebt({ debitorId: debt.debitor.id, creditorId: debt.creditor.id, amount: debt.amount, name: debt.name });
  }

  fetchDebtsAndBalanceFromApi(): void {
    this.subscriptions.push(this.apiService.getDebtBalance().subscribe(balances => {
      this.balances.next(balances);
    }));
    this.subscriptions.push(this.apiService.getMyDebts().subscribe(debts => {
      this.debts.next(debts);
    }));
  }

  getBalance(): Observable<Balance[]> {
    return this.balances;
  }

  getMyDebts(): Observable<Debt[]> {
    return this.debts;
  }
}
