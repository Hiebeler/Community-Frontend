import { Injectable, effect, signal } from '@angular/core';
import { ShoppingItemAdapter } from '../models/shopping-item.adapter';
import { ShoppingItem } from '../models/shopping-item.model';
import { ApiService } from './api.service';
import { AuthService } from './auth.service';
import { ApiResponse } from '../models/api-response';
import { map, Observable, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ShoppingService {
  // Signals instead of BehaviorSubjects
  openShoppingItems = signal<ShoppingItem[]>([]);
  doneShoppingItems = signal<ShoppingItem[]>([]);

  constructor(
    private apiService: ApiService,
    private shoppingItemAdapter: ShoppingItemAdapter,
    private authService: AuthService
  ) {
    // Automatically refetch whenever the active community changes
    effect(() => {
      const communityId = this.authService.activeCommunityId; // reactive
      this.fetchShoppingItemsFromApi();
    });
  }

  private fetchShoppingItemsFromApi(): void {
    // Fetch open items
    this.apiService.getOpenShoppingItems().subscribe((res) => {
      if (res.status === 'OK') {
        this.openShoppingItems.set(
          res.data.map(this.shoppingItemAdapter.adapt)
        );
      } else {
        this.openShoppingItems.set([]);
      }
    });

    // Fetch done items
    this.apiService.getDoneShoppingItems().subscribe((res) => {
      if (res.status === 'OK') {
        this.doneShoppingItems.set(
          res.data.map(this.shoppingItemAdapter.adapt)
        );
      } else {
        this.doneShoppingItems.set([]);
      }
    });
  }

  addShoppingItem(
    shoppingItem: ShoppingItem
  ): Observable<ApiResponse<ShoppingItem>> {
    return this.apiService.addShoppingItem(shoppingItem.name).pipe(
      map((res) => {
        const adapted = res.success
          ? this.shoppingItemAdapter.adapt(res.data)
          : null;
        if (adapted) {
          this.openShoppingItems.update((items) => [...items, adapted]);
        }
        return new ApiResponse<ShoppingItem>({ ...res, data: adapted });
      })
    );
  }

  updateShoppingItem(
    shoppingItem: ShoppingItem
  ): Observable<ApiResponse<ShoppingItem>> {
    return this.apiService
      .updateShoppingItem({
        id: shoppingItem.id,
        done: shoppingItem.done,
        name: shoppingItem.name,
      })
      .pipe(
        map((res) => {
          const adapted = res.success
            ? this.shoppingItemAdapter.adapt(res.data)
            : null;

          if (adapted) {
            if (shoppingItem.done) {
              // Update done items
              this.doneShoppingItems.update((items) =>
                items.map((i) => (i.id === adapted.id ? adapted : i))
              );
              // Remove from open items
              this.openShoppingItems.update((items) =>
                items.filter((i) => i.id !== adapted.id)
              );
            } else {
              // Update open items
              this.openShoppingItems.update((items) =>
                items.map((i) => (i.id === adapted.id ? adapted : i))
              );
              // Remove from done items
              this.doneShoppingItems.update((items) =>
                items.filter((i) => i.id !== adapted.id)
              );
            }
          }

          return new ApiResponse<ShoppingItem>({ ...res, data: adapted });
        })
      );
  }

  deleteShoppingItem(id: number): Observable<ApiResponse<ShoppingItem>> {
    return this.apiService.deleteShoppingItem(id).pipe(
      map((res) => {
        const adapted = res.success
          ? this.shoppingItemAdapter.adapt(res.data)
          : null;

        if (adapted) {
          // Remove the item from open items
          this.openShoppingItems.update((items) =>
            items.filter((i) => i.id !== adapted.id)
          );

          // Remove the item from done items
          this.doneShoppingItems.update((items) =>
            items.filter((i) => i.id !== adapted.id)
          );
        }

        return new ApiResponse<ShoppingItem>({ ...res, data: adapted });
      })
    );
  }
}
