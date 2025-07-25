import { Injectable, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Subscription } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { ApiService } from './api.service';
import { AlertService } from './alert.service';
import { StorageService } from './storage.service';
import { UserService } from './user.service';
import { CommunityService } from './community.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService implements OnDestroy {
  subscriptions: Subscription[] = [];

  authenticationState = new BehaviorSubject<string>(null);
  private decodedUserToken = null;

  private helper: JwtHelperService;

  constructor(
    private router: Router,
    private apiService: ApiService,
    private alertService: AlertService,
    private storageService: StorageService,
    private userService: UserService,
    private communityService: CommunityService
  ) {
    this.helper = new JwtHelperService();
    this.checkToken();

    this.subscriptions.push(this.authenticationState.subscribe((state) => {}));
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  checkToken() {
    const token = this.storageService.getToken();
    this.updateAuthenticationState(token);
    if (token) {
      const decoded = this.helper.decodeToken(token);
      const isExpired = this.helper.isTokenExpired(token);
      if (!isExpired) {
        this.decodedUserToken = decoded;
        this.userService.fetchUserFromApi(this.getUserIdFromToken());
      }
    }
  }

  updateAuthenticationState(token: string | null) {
    if (token) {
      const isExpired = this.helper.isTokenExpired(token);
      if (!isExpired) {
        const isInCommunity =
          this.storageService.getCurrentCommunity() !== null;
          console.log(isInCommunity)
        if (isInCommunity) {
          this.authenticationState.next('community');
        } else {
          this.authenticationState.next('onboarding');
        }
      } else {
        this.storageService.removeToken();
        this.authenticationState.next('none');
      }
    } else {
      this.authenticationState.next('none');
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
          this.decodedUserToken = this.helper.decodeToken(res.data.token);
          this.updateAuthenticationState(res.data.token);
          this.userService.fetchUserFromApi(this.getUserIdFromToken());
          this.router.navigate(['profile']);
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
    return this.decodedUserToken?.user?.id;
  }

  logout() {
    this.storageService.removeToken();
    this.storageService.removeCurrentCommunity();
    this.userService.clearData();
    this.communityService.clearData();
    this.decodedUserToken = null;
    this.authenticationState.next('none');
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
