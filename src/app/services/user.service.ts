import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, map, Observable, Subscription } from 'rxjs';
import { UserAdapter } from '../models/user.adapter';
import { User } from '../models/user.model';
import { ApiService } from './api.service';
import { AuthService } from './auth.service';
import { ApiResponse } from '../models/api-response';

@Injectable({
  providedIn: 'root',
})
export class UserService implements OnDestroy {
  subscriptions: Subscription[] = [];
  private user = new BehaviorSubject<User>(null);

  constructor(
    private apiService: ApiService,
    private userAdapter: UserAdapter,
    private authService: AuthService
  ) {
    this.subscriptions.push(
      this.authService.activeUserId.subscribe((id) => {
        if (!id) {
          this.user.next(null);
        } else {
          this.fetchUserFromApi(id);
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  getCurrentUser(): Observable<User> {
    return this.user;
  }

  fetchUserFromApi(id?: number): void {
    this.subscriptions.push(
      this.apiService
        .getUserById(id ?? this.user?.value?.id ?? -1)
        .pipe(map((data) => this.userAdapter.adapt(data.data)))
        .subscribe((user) => {
          this.user.next(user);
        })
    );
  }

  updateUser(data: any): Observable<boolean> {
    return this.apiService.updateUser(data).pipe(
      map((res) => {
        if (res.success) {
          return true;
        } else {
          return false;
        }
      })
    );
  }

  deleteUser(): Observable<ApiResponse<any>> {
    return this.apiService.deleteAccount()
  }
}
