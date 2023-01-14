import { User } from './user';

export class Debt {

  public id: number;
  public name: string;
  public amount: number;
  public debitor: User;

  constructor(id: number, name: string, amount: number, debitor: User) {
    this.id = id;
    this.name = name;
    this.amount = amount;
    this.debitor = debitor;
  }
}
