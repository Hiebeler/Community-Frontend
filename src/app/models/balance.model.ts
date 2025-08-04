import { ApiUser, User } from './user.model';

export interface ApiBalance {
  amount: number;
  debitor: ApiUser;
}

export class Balance {
  public amount: number;
  public debitor: User;

  constructor(amount: number, debitor: User) {
    this.amount = amount;
    this.debitor = debitor;
  }
}
