import { ApiUser, User } from './user.model';

export interface ApiBalance {
  amount: number;
  otherUser: ApiUser;
}

export class Balance {
  readonly amount: number;
  readonly debitor: User;

  constructor(params: { amount: number; debitor: User }) {
    this.amount = params.amount;
    this.debitor = params.debitor;
  }
}
