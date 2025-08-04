import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, map, Observable, Subscription } from 'rxjs';
import { Debt } from '../models/debt.model';
import { ApiService } from './api.service';
import { ApiBalance, Balance } from '../models/balance.model';
import { BalanceAdapter } from '../models/balance.adapter';
import { DebtAdapter } from '../models/debt.adapter';
import { CommunityService } from './community.service';
import { ApiResponse } from '../models/api-response';

@Injectable({
  providedIn: 'root'
})
export class DebtService implements OnDestroy {

  subscriptions: Subscription[] = [];
  private balances = new BehaviorSubject<Balance[]>([]);
  private debts = new BehaviorSubject<Debt[]>([]);
  constructor(
    private apiService: ApiService,
    private debtAdapter: DebtAdapter,
    private balanceAdapter: BalanceAdapter,
    private communityService: CommunityService
  ) {
    this.subscriptions.push(this.communityService.getCurrentCommunity().subscribe(community => {
      this.fetchDebtsAndBalanceFromApi();
    }));

  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  addDebt(debt: Debt): Observable<any> {
    return this.apiService.addDebt({
      debitorId: debt.debitor.id,
      creditorId: debt.creditor.id,
      amount: debt.amount,
      name: debt.name
    });
  }

  fetchDebtsAndBalanceFromApi(): void {
    this.subscriptions.push(this.apiService.getDebtBalance().pipe(
      map((data: ApiResponse<ApiBalance[]>) => data.data.map((item: ApiBalance) => this.balanceAdapter.adapt(item)))
    ).subscribe(balances => {
      this.balances.next(balances);
    }));
    this.subscriptions.push(this.apiService.getMyDebts().pipe(
      map((data: any) => data.data.map((item) => this.debtAdapter.adapt(item)))
    ).subscribe(debts => {
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
