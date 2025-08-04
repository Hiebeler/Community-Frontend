import { Injectable } from '@angular/core';
import { Adapter } from './adapter';
import { ApiBalance, Balance } from './balance.model';
import { UserAdapter } from './user.adapter';

@Injectable({
  providedIn: 'root',
})
export class BalanceAdapter implements Adapter<ApiBalance, Balance> {
  constructor(private userAdapter: UserAdapter) {}

  adapt(item: ApiBalance): Balance {
    return new Balance(item.amount, this.userAdapter.adapt(item.debitor));
  }
}
