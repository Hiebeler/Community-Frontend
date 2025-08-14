import { Injectable, effect, signal } from '@angular/core';
import { ShoppingItemAdapter } from '../models/shopping-item.adapter';
import { ShoppingItem } from '../models/shopping-item.model';
import { ApiService } from './api.service';
import { AuthService } from './auth.service';
import { ApiResponse } from '../models/api-response';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ShoppingService {
  openShoppingItems = signal<ShoppingItem[]>([]);
  doneShoppingItems = signal<ShoppingItem[]>([]);

  constructor(
    private apiService: ApiService,
    private shoppingItemAdapter: ShoppingItemAdapter,
    private authService: AuthService
  ) {
    effect(() => {
      const communityId = this.authService.activeCommunityId();
      if (communityId) {
        this.fetchShoppingItemsFromApi();
      } else {
        this.openShoppingItems.set([]);
        this.doneShoppingItems.set([]);
      }
    });
  }

  private fetchShoppingItemsFromApi(): void {
    this.apiService.getOpenShoppingItems().subscribe((res) => {
      if (res.success) {
        this.openShoppingItems.set(
          res.data.map(this.shoppingItemAdapter.adapt)
        );
      } else {
        this.openShoppingItems.set([]);
      }
    });

    this.apiService.getDoneShoppingItems().subscribe((res) => {
      if (res.success) {
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
        const apiResponse = new ApiResponse<ShoppingItem>({
          ...res,
          data: res.success ? this.shoppingItemAdapter.adapt(res.data) : null,
        });

        if (apiResponse.success && apiResponse.data) {
          this.openShoppingItems.update((shoppingItems) => [
            apiResponse.data,
            ...shoppingItems,
          ]);
        }

        return apiResponse;
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
            if (shoppingItem.done === true) {
              // remove from open
              this.openShoppingItems.update((items) =>
                items.filter((i) => i.id !== adapted.id)
              );
              // add/update in done
              this.doneShoppingItems.update((items) => {
                const exists = items.some((i) => i.id === adapted.id);
                return exists
                  ? items.map((i) => (i.id === adapted.id ? adapted : i))
                  : [adapted, ...items];
              });
            } else {
              // remove from done
              this.doneShoppingItems.update((items) =>
                items.filter((i) => i.id !== adapted.id)
              );
              // add/update in open
              this.openShoppingItems.update((items) => {
                const exists = items.some((i) => i.id === adapted.id);
                return exists
                  ? items.map((i) => (i.id === adapted.id ? adapted : i))
                  : [adapted, ...items];
              });
            }
          }

          return new ApiResponse<ShoppingItem>({ ...res, data: adapted });
        })
      );
  }

  deleteShoppingItem(id: number): Observable<ApiResponse<any>> {
    return this.apiService.deleteShoppingItem(id).pipe(
      map((res) => {
        if (res.success) {
          this.openShoppingItems.update((items) =>
            items.filter((i) => i.id !== id)
          );

          // Remove the item from done items
          this.doneShoppingItems.update((items) =>
            items.filter((i) => i.id !== id)
          );
        }

        return res;
      })
    );
  }
}
