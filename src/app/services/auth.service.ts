import { Injectable, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, Subscription, tap } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { ApiService } from './api.service';
import { AlertService } from './alert.service';
import { StorageService } from './storage.service';
import { ApiResponse } from '../models/api-response';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class AuthService implements OnDestroy {
  subscriptions: Subscription[] = [];

  activeUserId = new BehaviorSubject<number>(null);
  activeCommunityId = new BehaviorSubject<number>(null);

  private helper: JwtHelperService;

  constructor(
    private router: Router,
    private apiService: ApiService,
    private alertService: AlertService,
    private storageService: StorageService,
    private toastr: ToastrService
  ) {
    this.helper = new JwtHelperService();
    this.initializeValues();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  initializeValues() {
    const token = this.storageService.getToken();
    if (token) {
      const isExpired = this.helper.isTokenExpired(token);
      if (!isExpired) {
        this.activeUserId.next(this.getUserIdFromToken());
        this.activeCommunityId.next(this.storageService.getCurrentCommunity());
      }
    }
  }

  register(data: {
    email: string;
    name: string;
    password: string;
  }): Observable<ApiResponse<any>> {
    return this.apiService.register(data);
  }

  login(email, password): Observable<ApiResponse<any>> {
    return this.apiService.login(email, password).pipe(
      tap((res) => {
        if (res.success) {
          this.storageService.setToken(res.data.token);
          this.activeUserId.next(this.getUserIdFromToken());
        }
      })
    );
  }

  public requestPasswordReset(email: string): Observable<ApiResponse<any>> {
    return this.apiService.requestPasswordReset(email);
  }

  public resetPassword(
    newPassword: string,
    code: string
  ): Observable<ApiResponse<any>> {
    return this.apiService.resetPassword(newPassword, code);
  }

  public changePassword(
    oldPassword: string,
    newPassword: string
  ): Observable<ApiResponse<any>> {
    return this.apiService.changePassword(oldPassword, newPassword);
  }

  public getUserIdFromToken(): number | null {
    const token = this.storageService.getToken();
    const isExpired = this.helper.isTokenExpired(token);
    if (!isExpired) {
      const id = this.helper.decodeToken(token)?.user.id;
      return id;
    } else {
      this.storageService.removeToken();
      return null;
    }
  }

  logout() {
    this.storageService.removeToken();
    this.storageService.removeCurrentCommunity();
    this.activeCommunityId.next(null);
    this.activeUserId.next(null);
    this.router.navigate(['login']);
    this.toastr.success('Du bist jetzt ausgeloggt');
  }

  verify(code: string): Observable<ApiResponse<any>> {
    return this.apiService.verify(code);
  }

  resendVerificationEmail(email: string): Observable<ApiResponse<any>> {
    return this.apiService.resendVerificationEmail(email);
  }
}
