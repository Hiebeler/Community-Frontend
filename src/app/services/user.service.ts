import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../models/user';
import { ApiService } from './api.service';
import { tint, shade } from 'tint-shade-color';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private user = new BehaviorSubject<User>(null);

  constructor(
    private apiService: ApiService
  ) {
    this.getLatestUser().subscribe(user => {
      if (user) {
        // if (user.color) {
        //   document.documentElement.style.setProperty('--ion-color-primary', user.color);
        //   document.documentElement.style.setProperty('--ion-color-primary-shade', shade(user.color, 0.15));
        //   document.documentElement.style.setProperty('--ion-color-primary-tint', tint(user.color, 0.15));
        // }
      }
    });
  }

  getLatestUser(): Observable<User> {
    return this.user;
  }

  fetchUserFromApi(id: number): void {
    this.apiService.getUserById(id).subscribe(user => {
      this.user.next(user);
    });
  }

  clearData(): void {
    this.user.next(null);
  }
}
