import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Debt } from '../models/debt';
import { ApiService } from './api.service';
import { Balance } from '../models/balance';

@Injectable({
  providedIn: 'root'
})
export class DebtService {

  constructor(
    private apiService: ApiService
  ) { }

  addDebt(debt: Debt) {
    console.log(debt);
  }

  getBalance(): Observable<Balance[]> {
    return this.apiService.getDebtBalance();
  }
}
