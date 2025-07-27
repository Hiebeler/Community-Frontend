import { Injectable } from '@angular/core';
import { Adapter } from './adapter';
import { Balance } from '../models/balance';
import { UserAdapter } from './user-adapter';

@Injectable({
  providedIn: 'root',
})
export class BalanceAdapter implements Adapter<Balance> {
  constructor(private userAdapter: UserAdapter) {}

  adapt(item: any): Balance {
    return new Balance(item.amount, this.userAdapter.adapt(item.otherUser));
  }
}
