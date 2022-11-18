export class ShoppingItem {

  public id: number;
  public shoppingListId: number;
  public name: string;
  public done: boolean;

  constructor(data?: any) {
    this.id = data?.id;
    this.shoppingListId = data?.fk_shoppingList_id;
    this.name = data?.name;
    this.done = data?.done;
  }
}
