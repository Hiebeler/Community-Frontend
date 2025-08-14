import { effect, Injectable, OnDestroy, signal } from '@angular/core';
import { BehaviorSubject, map, Observable, Subscription } from 'rxjs';
import { UserAdapter } from '../models/user.adapter';
import { User } from '../models/user.model';
import { ApiService } from './api.service';
import { AuthService } from './auth.service';
import { ApiResponse } from '../models/api-response';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  user = signal<User | null>(null);

  constructor(
    private apiService: ApiService,
    private userAdapter: UserAdapter,
    private authService: AuthService
  ) {
    effect(() => {
      const userId = this.authService.activeUserId();
      if (!userId) {
        this.user.set(null);
      } else {
        this.fetchUserFromApi(userId);
      }
    });
  }

  getCurrentUser() {
    return this.user;
  }

  fetchUserFromApi(id?: number) {
    const userId = id ?? this.user()?.id ?? -1;
    this.apiService
      .getUserById(userId)
      .pipe(map((data) => this.userAdapter.adapt(data.data)))
      .subscribe((user) => this.user.set(user));
  }

  updateUser(data: any): Observable<boolean> {
    return this.apiService.updateUser(data).pipe(map((res) => res.success));
  }

  deleteUser(): Observable<ApiResponse<any>> {
    return this.apiService.deleteAccount();
  }

  sendFeedback(feedback: string): Observable<ApiResponse<any>> {
    return this.apiService.sendFeedback(feedback);
  }
}
