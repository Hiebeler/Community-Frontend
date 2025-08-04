import { Injectable, OnDestroy } from '@angular/core';
import {
  BehaviorSubject,
  concatMap,
  map,
  Observable,
  of,
  Subscription,
} from 'rxjs';
import { ShoppingItemAdapter } from '../models/shopping-item.adapter';
import { ShoppingItem } from '../models/shopping-item.model';
import { ApiService } from './api.service';
import { AuthService } from './auth.service';
import { ApiResponse } from '../models/api-response';

@Injectable({
  providedIn: 'root',
})
export class ShoppingService implements OnDestroy {
  subscriptions: Subscription[] = [];

  private openShoppingItems = new BehaviorSubject<ShoppingItem[]>([]);
  private doneShoppingItems = new BehaviorSubject<ShoppingItem[]>([]);

  constructor(
    private apiService: ApiService,
    private shoppingItemAdapter: ShoppingItemAdapter,
    private authService: AuthService
  ) {
    this.subscriptions.push(
      this.authService.activeCommunityId.subscribe(() => {
        this.fetchShoppingItemsFromApi();
      })
    );
  }

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
    this.subscriptions.push(
      this.apiService
        .getOpenShoppingItems()
        .pipe(
          concatMap((res) => {
            if (res.status !== 'OK') {
              return [];
            } else {
              return of(res);
            }
          }),
          map((res: any) =>
            res.data.map((item) => this.shoppingItemAdapter.adapt(item))
          )
        )
        .subscribe((openItems) => {
          this.openShoppingItems.next(openItems);
        })
    );

    this.subscriptions.push(
      this.apiService
        .getDoneShoppingItems()
        .pipe(
          concatMap((res) => {
            if (res.status !== 'OK') {
              return [];
            } else {
              return of(res);
            }
          }),
          map((res: any) =>
            res.data.map((item) => this.shoppingItemAdapter.adapt(item))
          )
        )
        .subscribe((doneItems) => {
          this.doneShoppingItems.next(doneItems);
        })
    );
  }

  addShoppingItem(shoppingItem: ShoppingItem): Observable<ApiResponse<ShoppingItem>> {
    return this.apiService.addShoppingItem(shoppingItem.name);
  }

  updateShoppingItem(shoppingItem: ShoppingItem): Observable<ApiResponse<ShoppingItem>> {
    return this.apiService.updateShoppingItem({
      id: shoppingItem.id,
      done: shoppingItem.done,
      name: shoppingItem.name,
    });
  }

  deleteShoppingItem(id: number): Observable<ApiResponse<ShoppingItem>> {
    return this.apiService.deleteShoppingItem(id);
  }
}
