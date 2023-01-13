export class Debt {

  public id: number;
  public name: string;
  public amount: number;
  public debitorId: number;
  public creditorId: number;

  constructor(id: number, name: string, amount: number, debitorId: number, creditorId: number) {
    this.id = id;
    this.name = name;
    this.amount = amount;
    this.debitorId = debitorId;
    this.creditorId = creditorId;
  }
}
