export interface ApiShoppingItem {
  id: number;
  name: string;
  done: boolean;
}

export class ShoppingItem {
  public id: number;
  public name: string;
  public done: boolean;

  constructor(id: number, name: string, done: boolean) {
    this.id = id;
    this.name = name;
    this.done = done;
  }
}
