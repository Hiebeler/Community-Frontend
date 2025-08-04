export interface ApiShoppingItem {
  id: number;
  name: string;
  done: boolean;
}

export class ShoppingItem {
  readonly id: number;
  public name: string;
  public done: boolean;

  constructor(params: {id: number, name: string, done: boolean}) {
    this.id = params.id;
    this.name = params.name;
    this.done = params.done;
  }
}
