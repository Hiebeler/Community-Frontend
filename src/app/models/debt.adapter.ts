import { Injectable } from '@angular/core';
import { ApiDebt, Debt } from './debt.model';
import { Adapter } from './adapter';
import { UserAdapter } from './user.adapter';

@Injectable({
  providedIn: 'root',
})

export class DebtAdapter implements Adapter<ApiDebt, Debt> {

  constructor(private userAdapter: UserAdapter) {}

  adapt(item: ApiDebt): Debt {

    const debitor = this.userAdapter.adapt(item.debitor)
    const creditor = this.userAdapter.adapt(item.creditor)

    return new Debt(
      item.id,
      item.name,
      item.amount,
      debitor,
      creditor,
      new Date(item.timestamp)
    );
  }
}
