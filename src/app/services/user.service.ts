import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, map, Observable, Subscription } from 'rxjs';
import { UserAdapter } from '../adapter/user-adapter';
import { User } from '../models/user';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class UserService implements OnDestroy {

  subscriptions: Subscription[] = [];
  private user = new BehaviorSubject<User>(null);

  constructor(
    private apiService: ApiService,
    private userAdapter: UserAdapter,
  ) {
    this.subscriptions.push(this.getCurrentUser().subscribe());
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  getCurrentUser(): Observable<User> {
    return this.user;
  }

  fetchUserFromApi(id?: number): void {
    this.subscriptions.push(this.apiService.getUserById(id ?? this.user.value.id ?? -1).pipe(
      map(data => this.userAdapter.adapt(data.data))
    ).subscribe(user => {
      this.user.next(user);
    }));
  }

  updateUser(data: any): Observable<boolean> {
    return this.apiService.updateUser(data).pipe(
      map(res => {
        if (res.status === 'OK') {
          return true;
        } else {
          return false;
        }
      }));
  }

  clearData(): void {
    this.user.next(null);
  }
}
