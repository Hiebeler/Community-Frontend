import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../models/user';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private user = new BehaviorSubject<User>(null);

  constructor(
    private apiService: ApiService
  ) {
    this.getLatestUser().subscribe(user => { });
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
