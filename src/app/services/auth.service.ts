import { Injectable, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Subscription } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
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
        msg = res.error;
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
            this.router.navigate(['tabs/profile']);
          }
        }
      );
    }));
  }

  login(email, password) {
    return this.subscriptions.push(this.apiService.login(email, password).subscribe(async res => {
      console.log(res);
      if (res.status === 'OK') {
        this.storeToken(res.data.token);
        this.decodedUserToken = this.helper.decodeToken(res.data.token);
        this.updateAuthenticationState(this.decodedUserToken);
        this.userService.fetchUserFromApi(this.getUserFromToken().id);
        this.router.navigate(['tabs/profile']);
      }
      else {
        this.alertService.showAlert('Ooops', res.error);
      }

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
      if (res.status === 'OK') {
        this.userService.fetchUserFromApi(this.getUserFromToken().id);
      }
      else {
        this.alertService.showAlert(res.data.header, res.data.message);
      }

    }));
  }
}
