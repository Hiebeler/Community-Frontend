import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { User } from '../models/user';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class UserService implements OnDestroy {

  subscriptions: Subscription[] = [];
  private user = new BehaviorSubject<User>(null);
  private usersInCommunity = new BehaviorSubject<User[]>([]);

  constructor(
    private apiService: ApiService
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
    this.subscriptions.push(this.apiService.getUserById(id ?? this.user.value.id ?? -1).subscribe(user => {
      this.user.next(user);
      this.fetchUsersInCommunityFromApi(user.communityId);
    }));
  }

  getUsersInCurrentCommunity(): Observable<User[]> {
    return this.usersInCommunity;
  }

  fetchUsersInCommunityFromApi(id: number): void {
    if (id) {
      this.subscriptions.push(this.apiService.getUsersInCommunity(id).subscribe(users => {
        this.usersInCommunity.next(users);
      }));
    }
  }

  clearData(): void {
    this.user.next(null);
    this.usersInCommunity.next([]);
  }
}
