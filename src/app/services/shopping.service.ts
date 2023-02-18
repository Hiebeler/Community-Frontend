import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, concatMap, map, Observable, of, Subscription } from 'rxjs';
import { ShoppingItemAdapter } from '../adapter/shopping-item-adapter';
import { ShoppingItem } from '../models/shopping-item';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class ShoppingService implements OnDestroy {

  subscriptions: Subscription[] = [];

  private openShoppingItems = new BehaviorSubject<ShoppingItem[]>([]);
  private doneShoppingItems = new BehaviorSubject<ShoppingItem[]>([]);

  constructor(
    private apiService: ApiService,
    private shoppingItemAdapter: ShoppingItemAdapter
  ) { }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  getOpenShoppingItems(): Observable<ShoppingItem[]> {
    return this.openShoppingItems;
  }

  getDoneShoppingItems(): Observable<ShoppingItem[]> {
    return this.doneShoppingItems;
  }

  fetchShoppingItemsFromApi(): void {
    this.subscriptions.push(this.apiService.getOpenShoppingItems().pipe(
      concatMap(res => {
        if (res.status !== 'OK') {
          return [];
        } else {
          return of(res);
        }
      }), map((res: any) => res.data.map((item) => this.shoppingItemAdapter.adapt(item)))
    ).subscribe(openItems => {
      this.openShoppingItems.next(openItems);
    }));

    this.subscriptions.push(this.apiService.getDoneShoppingItems().pipe(
      concatMap(res => {
        if (res.status !== 'OK') {
          return [];
        } else {
          return of(res);
        }
      }), map((res: any) => res.data.map((item) => this.shoppingItemAdapter.adapt(item)))
    ).subscribe(doneItems => {
      this.doneShoppingItems.next(doneItems);
    }));
  }

  addShoppingItem(shoppingItem: ShoppingItem): Observable<any> {
    return this.apiService.addShoppingItem(shoppingItem.name);
  }

  updateShoppingItem(shoppingItem: ShoppingItem): Observable<any> {
    return this.apiService.updateShoppingItem({ id: shoppingItem.id, done: shoppingItem.done, name: shoppingItem.name });
  }
}
