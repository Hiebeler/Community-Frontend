import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ShoppingItem } from '../models/shopping-item';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class ShoppingService {

  private openShoppingItems = new BehaviorSubject<ShoppingItem[]>([]);
  private doneShoppingItems = new BehaviorSubject<ShoppingItem[]>([]);

  constructor(private apiService: ApiService) { }

  getOpenShoppingItems(): Observable<ShoppingItem[]> {
    return this.openShoppingItems;
  }

  getDoneShoppingItems(): Observable<ShoppingItem[]> {
    return this.doneShoppingItems;
  }

  fetchShoppingItemsFromApi(): void {
    this.apiService.getOpenShoppingItems().subscribe(openItems => {
      this.openShoppingItems.next(openItems);
    });

    this.apiService.getDoneShoppingItems().subscribe(doneItems => {
      this.doneShoppingItems.next(doneItems);
    });
  }

  addShoppingItem(name: string): Observable<any> {
    return this.apiService.addShoppingItem({ name });
  }

  updateShoppingItem(id: number, done?: boolean, name?: string): Observable<any> {
    return this.apiService.updateShoppingItem({ id, done, name });
  }
}
