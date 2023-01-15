import { Injectable } from '@angular/core';
import { Debt } from '../models/debt';
import { Adapter } from './adapter';

@Injectable({
  providedIn: 'root',
})

export class DebtAdapter implements Adapter<Debt> {
  adapt(item: any): Debt {
    return new Debt(
      item.id,
      item.name,
      item.amount,
      item.user,
      item.user_debt_fk_user_creditor_idTouser,
      new Date(item.timestamp)
    );
  }
}
