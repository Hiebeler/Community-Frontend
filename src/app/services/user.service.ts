import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../models/user';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private user = new BehaviorSubject<User>(null);
  private usersInCommunity = new BehaviorSubject<User[]>([]);

  constructor(
    private apiService: ApiService
  ) {
    this.getCurrentUser().subscribe(user => {
      if (user) {
        // if (user.color) {
        //   document.documentElement.style.setProperty('--ion-color-primary', user.color);
        //   document.documentElement.style.setProperty('--ion-color-primary-shade', shade(user.color, 0.15));
        //   document.documentElement.style.setProperty('--ion-color-primary-tint', tint(user.color, 0.15));
        // }
      }
    });
  }

  getCurrentUser(): Observable<User> {
    return this.user;
  }

  fetchUserFromApi(id?: number): void {
    this.apiService.getUserById(id ?? this.user.value.id ?? -1).subscribe(user => {
      this.user.next(user);
      this.fetchUsersInCommunityFromApi(user.communityId);
    });
  }

  getUsersInCurrentCommunity(): Observable<User[]> {
    return this.usersInCommunity;
  }

  fetchUsersInCommunityFromApi(id: number): void {
    this.apiService.getUsersInCommunity(id).subscribe(users => {
      this.usersInCommunity.next(users);
    });
  }

  clearData(): void {
    this.user.next(null);
  }
}
