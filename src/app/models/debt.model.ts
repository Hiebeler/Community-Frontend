import { ApiUser, User } from './user.model';

export interface ApiDebt {
  id: number;
  name: string;
  amount: number;
  timestamp?: string;
  debitor: ApiUser;
  creditor: ApiUser;
}

export class Debt {
  public id: number;
  public name: string;
  public amount: number;
  public timestamp: Date;
  public debitor: User;
  public creditor: User;

  constructor(
    id: number,
    name: string,
    amount: number,
    debitor: User,
    creditor: User,
    timestamp?: Date
  ) {
    this.id = id;
    this.name = name;
    this.amount = amount;
    this.debitor = debitor;
    this.creditor = creditor;
    this.timestamp = timestamp;
  }
}
