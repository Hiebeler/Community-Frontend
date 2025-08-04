import { Injectable } from '@angular/core';
import { ApiShoppingItem, ShoppingItem } from './shopping-item.model';
import { Adapter } from './adapter';

@Injectable({
  providedIn: 'root',
})
export class ShoppingItemAdapter
  implements Adapter<ApiShoppingItem, ShoppingItem>
{
  adapt(item: ApiShoppingItem): ShoppingItem {
    return new ShoppingItem(item.id, item.name, item.done);
  }
}
