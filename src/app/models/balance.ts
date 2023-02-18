import { User } from './user';

export class Balance {

  public amount: number;
  public debitor: User;

  constructor(amount: number, debitor: User) {
    this.amount = amount;
    this.debitor = debitor;
  }
}
