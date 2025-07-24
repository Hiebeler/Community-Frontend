import { Injectable, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Subscription } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { ApiService } from './api.service';
import { AlertService } from './alert.service';
import { StorageService } from './storage.service';
import { UserService } from './user.service';
import { User } from '../models/user';
import { ShoppingService } from './shopping.service';
import { CommunityService } from './community.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
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
    private shoppingService: ShoppingService,
    private communityService: CommunityService
  ) {
    this.helper = new JwtHelperService();
    this.checkToken();

    this.subscriptions.push(this.authenticationState.subscribe(state => {
    }));

    this.subscriptions.push(this.userService.getCurrentUser().subscribe(user => {
      if (this.storageService.getToken()) {
        const tokenCommunityId = this.helper.decodeToken(this.storageService.getToken()).communities;
        if (user && user?.communities === tokenCommunityId) {
          this.requestNewToken();
        }
      }
    }));
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  checkToken() {
    const token = this.storageService.getToken();
    if (token) {
      const decoded = this.helper.decodeToken(token);
      const isExpired = this.helper.isTokenExpired(token);

      if (!isExpired) {
        this.decodedUserToken = decoded;
        this.updateAuthenticationState(decoded);
        this.userService.fetchUserFromApi(this.getUserFromToken().id);
        this.shoppingService.fetchShoppingItemsFromApi();
      }
      if (decoded.version !== environment.jwtVersion) {
        this.requestNewToken();
      }
    }
    else {
      this.authenticationState.next('none');
    }
  }

  async storeToken(token) {
    await this.storageService.setToken(token);
  }

  updateAuthenticationState(token) {
    if (!token.version) {
      this.requestNewToken();
    } else {
      if (token.user.communities && token.user.communities.length > 0) {
        this.authenticationState.next('community');
      } else {
        this.authenticationState.next('onboarding');
      }
    }
  }

  requestNewToken() {
    this.subscriptions.push(this.apiService.getNewJWT().subscribe(res => {
      if (res.status === 'OK') {
        this.storeToken(res.data.token);
        this.checkToken();
      }
    }));
  }

  register(email, name, password) {

    const obj = {
      email,
      name,
      password
    };

    return this.subscriptions.push(this.apiService.register(obj).subscribe(async res => {
      let head = 'Gratuliere';
      let msg = 'Registrierung erfolgreich, Ihnen wurde eine Email zugesended, um ihren account zu verifizieren';
      if (res.status === 'Error') {
        head = 'Error!';
        msg = res.error;
      }

      this.alertService.showAlert(
        head,
        msg,
        'Okay',
        async () => {
          if (res.status === 'OK') {
            this.router.navigate(['login']);
          }
        }
      );
    }));
  }

  login(email, password) {
    return this.subscriptions.push(this.apiService.login(email, password).subscribe(async res => {
      if (res.status === 'OK') {
        this.storeToken(res.data.token);
        this.decodedUserToken = this.helper.decodeToken(res.data.token);
        this.updateAuthenticationState(this.decodedUserToken);
        this.userService.fetchUserFromApi(this.getUserFromToken().id);
        this.router.navigate(['profile']);
      }
      else {
        if (res.data.verified === false) {
          this.alertService.showAlert('not verified', res.error, 'Resend Verification Email', () => {
            this.resendVerificationEmail(email);
          }, 'Okay');
        } else {
          this.alertService.showAlert('Ooops', res.error);
        }
      }

    }));
  }

  public getUserFromToken() {
    return this.decodedUserToken.user;
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

  updateUser(updatedUser: User) {
    const url: any = updatedUser.profileimage;
    const dataToUpdate = {
      id: this.getUserFromToken().id,
      name: updatedUser.name,
      profilepicture: url.changingThisBreaksApplicationSecurity
    };
    return this.subscriptions.push(this.apiService.updateUser(dataToUpdate).subscribe(async res => {
      if (res.status === 'OK') {
        this.userService.fetchUserFromApi(this.getUserFromToken().id);
      }
      else {
        this.alertService.showAlert(res.data.header, res.data.message);
      }

    }));
  }

  verify(code: string) {
    return this.subscriptions.push(this.apiService.verify(code).subscribe(async res => {
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
      }
      else {
        this.alertService.showAlert('Ooops', res.error);
      }

    }));
  }

  resendVerificationEmail(email: string) {
   return this.subscriptions.push(this.apiService.resendVerificationEmail(email).subscribe(async res => {
      if (res.status === 'OK') {

        this.alertService.showAlert(
          'Resent Verification Email',
          'You Received an email with an link to verify your account',
          'Okay',
        );
      }
      else {
        this.alertService.showAlert('Ooops', res.error);
      }

    }));
  }
}
