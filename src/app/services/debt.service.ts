import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Debt } from '../models/debt';
import { ApiService } from './api.service';
import { Balance } from '../models/balance';

@Injectable({
  providedIn: 'root'
})
export class DebtService {
  private balances = new BehaviorSubject<Balance[]>([]);
  constructor(
    private apiService: ApiService
  ) { }

  addDebt(debt: Debt): Observable<any> {
    console.log(debt);
    return this.apiService.addDebt({ debitorId: debt.debitor.id, creditorId: debt.creditor.id, amount: debt.amount, name: debt.name });
  }

  fetchDebtsAndBalanceFromApi(): void {
    this.apiService.getDebtBalance().subscribe(balances => {
      this.balances.next(balances);
    });
  }

  getBalance(): Observable<Balance[]> {
    return this.balances;
  }
}
