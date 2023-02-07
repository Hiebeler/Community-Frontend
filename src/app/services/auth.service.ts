import { Injectable, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Subscription } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { catchError } from 'rxjs/operators';
import { ApiService } from './api.service';
import { AlertService } from './alert.service';
import { Platform } from '@ionic/angular';
import { StorageService } from './storage.service';
import { UserService } from './user.service';
import { User } from '../models/user';
import { ShoppingService } from './shopping.service';
import { CommunityService } from './community.service';

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
    private platform: Platform,
    private apiService: ApiService,
    private alertService: AlertService,
    private storageService: StorageService,
    private userService: UserService,
    private shoppingService: ShoppingService,
    private communityService: CommunityService
  ) {
    this.helper = new JwtHelperService();
    this.platform.ready().then(() => {
      this.checkToken();
    });

    this.subscriptions.push(this.authenticationState.subscribe(state => {
      console.log('meem:', state);
    }));

    this.subscriptions.push(this.userService.getCurrentUser().subscribe(user => {
      if (this.storageService.getToken()) {
        const tokenCommunityId = this.helper.decodeToken(this.storageService.getToken()).communityId;
        if (user && user?.communityId !== tokenCommunityId) {
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
      if (token.communityId) {
        this.authenticationState.next('community');
      } else {
        this.authenticationState.next('user');
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

  register(email, firstname, lastname, password) {

    const obj = {
      email,
      firstname,
      lastname,
      password
    };

    return this.subscriptions.push(this.apiService.register(obj).subscribe(async res => {
      let head = 'Gratuliere';
      let msg = 'Registrierung erfolgreich';
      if (res.status === 'Error') {
        head = 'Error!';
        msg = res.errors[0];
      }

      this.alertService.showAlert(
        head,
        msg,
        'Okay',
        async () => {
          if (res.status === 'OK') {
            this.storeToken(res.data.token);
            this.decodedUserToken = this.helper.decodeToken(res.data.token);
            this.updateAuthenticationState(this.decodedUserToken);
            this.userService.fetchUserFromApi(this.getUserFromToken().id);
            this.router.navigate(['/tabs/profile']);
          }
        }
      );
    })),
      catchError(e => {
        this.alertService.showAlert('Error', e.error.message);
        throw new Error(e);
      });
  }

  login(email, password) {
    return this.subscriptions.push(this.apiService.login(email, password).subscribe(async res => {
      if (res.status === 'OK') {
        this.storeToken(res.data.token);
        this.decodedUserToken = this.helper.decodeToken(res.data.token);
        this.updateAuthenticationState(this.decodedUserToken);
        this.userService.fetchUserFromApi(this.getUserFromToken().id);
        this.router.navigate(['/tabs/profile']);
      }
      else {
        this.alertService.showAlert('Ooops', res.errors[0]);
      }

    })),
      catchError(e => {
        this.alertService.showAlert('Error', e.error.message);
        throw new Error(e);
      });
  }

  sendVerificationMailAgain(email) {
    this.subscriptions.push(this.apiService.sendVerificationMailAgain(email).subscribe(async res => {
      this.alertService.showAlert(res.header, res.message);
    }));
  }

  public getUserFromToken() {
    return this.decodedUserToken;
  }

  logout() {
    this.storageService.removeToken();
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
      firstname: updatedUser.firstname,
      lastname: updatedUser.lastname,
      profilepicture: url.changingThisBreaksApplicationSecurity
    };
    return this.subscriptions.push(this.apiService.updateUser(dataToUpdate).subscribe(async res => {
      if (res.status === 200) {
        this.userService.fetchUserFromApi(this.getUserFromToken().id);
      }
      else {
        this.alertService.showAlert(res.header, res.message);
      }

    })),
      catchError(e => {
        this.alertService.showAlert('Error', e.error.message);
        throw new Error(e);
      });
  }

  changePassword(oldPassword, newPassword1, newPassword2) {
    const obj = {
      oldPassword,
      newPassword1,
      newPassword2,
      id: this.getUserFromToken().id
    };
    return this.subscriptions.push(this.apiService.changePassword(obj).subscribe(async res => {
      this.alertService.showAlert(res.header, res.message);

    })),
      catchError(e => {
        this.alertService.showAlert('Error', e.error.message);
        throw new Error(e);
      });
  }

  resetPassword(email) {
    return this.subscriptions.push(this.apiService.resetPassword(email).subscribe(async res => {
      this.alertService.showAlert(res.header, res.message);

    })),
      catchError(e => {
        this.alertService.showAlert('Error', e.error.message);
        throw new Error(e);
      });
  }

  setPassword(vcode, pw1, pw2) {
    const obj = {
      vcode,
      pw1,
      pw2
    };
    this.subscriptions.push(this.apiService.setPassword(obj).subscribe(async res => {
      if (res.stay) {
        this.alertService.showAlert(res.header, res.message);
      }
      else {
        this.alertService.showAlert(
          res.header,
          res.message,
          'Okay',
          this.router.navigate.bind(this, ['login'])
        );
      }
    }));
  }
}
