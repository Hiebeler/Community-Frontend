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
  readonly id: number;
  readonly name: string;
  readonly amount: number;
  readonly timestamp: Date;
  readonly debitor: User;
  readonly creditor: User;

  constructor(params: {
    id: number;
    name: string;
    amount: number;
    debitor: User;
    creditor: User;
    timestamp?: Date;
  }) {
    this.id = params.id;
    this.name = params.name;
    this.amount = params.amount;
    this.debitor = params.debitor;
    this.creditor = params.creditor;
    this.timestamp = params.timestamp;
  }
}
