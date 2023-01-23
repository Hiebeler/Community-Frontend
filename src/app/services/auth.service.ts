import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { catchError } from 'rxjs/operators';
import { ApiService } from './api.service';
import { AlertService } from './alert.service';
import { Platform } from '@ionic/angular';
import { StorageService } from './storage.service';
import { UserService } from './user.service';
import { User } from '../models/user';
import { ShoppingService } from './shopping.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

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
    private shoppingService: ShoppingService
  ) {
    this.helper = new JwtHelperService();
    this.platform.ready().then(() => {
      this.checkToken();
    });

    this.authenticationState.subscribe(state => {
      console.log(state);
    });
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
    console.log('updateAuthenticationState');
    console.log(token);
    if (!token.version) {
      console.log(token.version);
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
    this.apiService.getNewJWT().subscribe(res => {
      if (res.status === 'OK') {
        this.storeToken(res.data.token);
        this.decodedUserToken = this.helper.decodeToken(res.data.token);
        this.updateAuthenticationState(this.decodedUserToken);
        console.log(this.decodedUserToken);
      }
    });
  }

  register(email, firstname, lastname, password) {

    const obj = {
      email,
      firstname,
      lastname,
      password
    };

    return this.apiService.register(obj).subscribe(async res => {
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
    }),
      catchError(e => {
        this.alertService.showAlert('Error', e.error.message);
        throw new Error(e);
      });
  }

  login(email, password) {
    return this.apiService.login(email, password).subscribe(async res => {
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

    }),
      catchError(e => {
        this.alertService.showAlert('Error', e.error.message);
        throw new Error(e);
      });
  }

  sendVerificationMailAgain(email) {
    this.apiService.sendVerificationMailAgain(email).subscribe(async res => {
      this.alertService.showAlert(res.header, res.message);
    });
  }

  public getUserFromToken() {
    return this.decodedUserToken;
  }

  logout() {
    this.storageService.removeToken();
    this.userService.clearData();
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
    return this.apiService.updateUser(dataToUpdate).subscribe(async res => {
      if (res.status === 200) {
        this.userService.fetchUserFromApi(this.getUserFromToken().id);
      }
      else {
        this.alertService.showAlert(res.header, res.message);
      }

    }),
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
    return this.apiService.changePassword(obj).subscribe(async res => {
      this.alertService.showAlert(res.header, res.message);

    }),
      catchError(e => {
        this.alertService.showAlert('Error', e.error.message);
        throw new Error(e);
      });
  }

  resetPassword(email) {
    return this.apiService.resetPassword(email).subscribe(async res => {
      this.alertService.showAlert(res.header, res.message);

    }),
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
    this.apiService.setPassword(obj).subscribe(async res => {
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
    });
  }
}
