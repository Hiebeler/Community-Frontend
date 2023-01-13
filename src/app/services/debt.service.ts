import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Debt } from '../models/debt';
import { ApiService } from './api.service';

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
}
