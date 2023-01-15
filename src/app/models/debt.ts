import { User } from './user';

export class Debt {

  public id: number;
  public name: string;
  public amount: number;
  public timestamp: Date;
  public debitor: User;
  public creditor: User;

  constructor(id: number, name: string, amount: number, timestamp: Date, debitor: User, creditor: User) {
    this.id = id;
    this.name = name;
    this.amount = amount;
    this.debitor = debitor;
    this.creditor = creditor;
    this.timestamp = timestamp;
  }
}
