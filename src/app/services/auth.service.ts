import { Injectable, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Subscription } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { ApiService } from './api.service';
import { AlertService } from './alert.service';
import { StorageService } from './storage.service';

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
    private storageService: StorageService
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

  register(email, name, password) {
    const obj = {
      email,
      name,
      password,
    };

    return this.subscriptions.push(
      this.apiService.register(obj).subscribe(async (res) => {
        let head = 'Gratuliere';
        let msg =
          'Registrierung erfolgreich, Ihnen wurde eine Email zugesended, um ihren account zu verifizieren';
        if (res.status === 'Error') {
          head = 'Error!';
          msg = res.error;
        }

        this.alertService.showAlert(head, msg, 'Okay', async () => {
          if (res.status === 'OK') {
            this.router.navigate(['login']);
          }
        });
      })
    );
  }

  login(email, password) {
    return this.subscriptions.push(
      this.apiService.login(email, password).subscribe(async (res) => {
        if (res.status === 'OK') {
          this.storageService.setToken(res.data.token);
          this.activeUserId.next(this.getUserIdFromToken());
          this.router.navigate(['/onboarding']);
        } else {
          if (res.data.verified === false) {
            this.alertService.showAlert(
              'not verified',
              res.error,
              'Resend Verification Email',
              () => {
                this.resendVerificationEmail(email);
              },
              'Okay'
            );
          } else {
            this.alertService.showAlert('Ooops', res.error);
          }
        }
      })
    );
  }

  public getUserIdFromToken(): number | null {
    const token = this.storageService.getToken();
    const isExpired = this.helper.isTokenExpired(token);
    if (!isExpired) {
      const id = this.helper.decodeToken(token)?.user.id;
      return id;
    } else {
      this.storageService.removeToken();
      return null
    }
  }

  logout() {
    this.storageService.removeToken();
    this.storageService.removeCurrentCommunity();
    this.activeCommunityId.next(null);
    this.activeUserId.next(null);
    this.router.navigate(['login']);
  }

  verify(code: string) {
    return this.subscriptions.push(
      this.apiService.verify(code).subscribe(async (res) => {
        if (res.status === 'OK') {
          this.alertService.showAlert(
            'Verified',
            'Your Account is now verified, you can now login to your account',
            'Okay',
            async () => {
              if (res.status === 'OK') {
                this.router.navigate(['login']);
              }
            }
          );
        } else {
          this.alertService.showAlert('Ooops', res.error);
        }
      })
    );
  }

  resendVerificationEmail(email: string) {
    return this.subscriptions.push(
      this.apiService.resendVerificationEmail(email).subscribe(async (res) => {
        if (res.status === 'OK') {
          this.alertService.showAlert(
            'Resent Verification Email',
            'You Received an email with an link to verify your account',
            'Okay'
          );
        } else {
          this.alertService.showAlert('Ooops', res.error);
        }
      })
    );
  }
}
