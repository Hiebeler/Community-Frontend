import { Injectable } from '@angular/core';
import { ShoppingItem } from '../models/shopping-item';
import { Adapter } from './adapter';

@Injectable({
  providedIn: 'root',
})

export class ShoppingItemAdapter implements Adapter<ShoppingItem> {
  adapt(item: any): ShoppingItem {
    return new ShoppingItem(item.id, item.name, item.done);
  }
}
