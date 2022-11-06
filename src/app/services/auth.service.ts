import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { catchError } from 'rxjs/operators';
import { ApiService } from './api.service';
import { AlertService } from './alert.service';
import { AlertController, Platform } from '@ionic/angular';
import { StorageService } from './storage.service';
import { UserService } from './user.service';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  authenticationState = new BehaviorSubject<boolean>(null);
  private decodedUserToken = null;

  private helper: JwtHelperService;

  constructor(
    private router: Router,
    private platform: Platform,
    private apiService: ApiService,
    private alertService: AlertService,
    private alertController: AlertController,
    private storageService: StorageService,
    private userService: UserService
  ) {
    this.helper = new JwtHelperService();
    this.platform.ready().then(() => {
      this.checkToken();
    });
  }

  checkToken() {
    const token = this.storageService.getToken();
    if (token) {
      console.log(token);
      const decoded = this.helper.decodeToken(token);
      const isExpired = this.helper.isTokenExpired(token);

      console.log(decoded);

      if (!isExpired) {
        this.decodedUserToken = decoded;
        this.authenticationState.next(true);
        this.userService.fetchUserFromApi(this.getUser().id);
      }
    }
    else {
      this.authenticationState.next(false);
    }
  }

  register(email, firstname, lastname, password) {

    const obj = {
      email,
      firstname,
      lastname,
      password
    };

    return this.apiService.register(obj).subscribe(async res => {
      console.log(res);
      let head = 'Gratuliere';
      let msg = 'Registrierung erfolgreich';
      if (res.status === 'Error') {
        head = 'Error!';
        msg = res.errors[0];
      }

      const alert = this.alertController.create({
        cssClass: 'custom-alert-ok',
        backdropDismiss: false,
        header: head,
        message: msg,
        buttons: [{
          text: 'Okay',
          role: 'ok',
          handler: async () => {
            if (res.status === 'ok') {
              await this.storageService.setToken(res.data.token);
              this.decodedUserToken = this.helper.decodeToken(res.token);
              this.authenticationState.next(true);
              this.userService.fetchUserFromApi(this.getUser().id);
              this.router.navigate(['profile']);
            }
          }
        }]
      });
      alert.then(createdAlert => createdAlert.present());
    }),
      catchError(e => {
        this.alertService.showOkayAlertWithoutAction('Error', e.error.message);
        throw new Error(e);
      });
  }

  login(email, password) {
    return this.apiService.login(email, password).subscribe(async res => {
      console.log(res);
      if (res.status === 'OK') {
        await this.storageService.setToken(res.data.token);
        this.decodedUserToken = this.helper.decodeToken(res.data.token);
        this.authenticationState.next(true);
        this.userService.fetchUserFromApi(this.getUser().id);
        this.router.navigate(['profile']);
      }
      else {
        this.alertService.showOkayAlertWithoutAction('Ooops', res.errors[0]);
      }

    }),
      catchError(e => {
        this.alertService.showOkayAlertWithoutAction('Error', e.error.message);
        throw new Error(e);
      });
  }

  sendVerificationMailAgain(email) {
    this.apiService.sendVerificationMailAgain(email).subscribe(async res => {
      this.alertService.showOkayAlertWithoutAction(res.header, res.message);
    });
  }

  public getUser() {
    return this.decodedUserToken;
  }

  logout() {
    this.storageService.removeToken();
    this.userService.clearData();
    this.decodedUserToken = null;
    this.authenticationState.next(false);
    this.router.navigate(['login']);
  }

  updateUser(updatedUser: User) {
    const url: any = updatedUser.profileimage;
    const dataToUpdate = {
      id: this.getUser().id,
      firstname: updatedUser.firstname,
      lastname: updatedUser.lastname,
      profilepicture: url.changingThisBreaksApplicationSecurity
    };
    return this.apiService.updateUser(dataToUpdate).subscribe(async res => {
      if (res.status === 200) {
        this.userService.fetchUserFromApi(this.getUser().id);
      }
      else {
        this.alertService.showOkayAlertWithoutAction(res.header, res.message);
      }

    }),
      catchError(e => {
        this.alertService.showOkayAlertWithoutAction('Error', e.error.message);
        throw new Error(e);
      });
  }

  changePassword(oldPassword, newPassword1, newPassword2) {
    const obj = {
      oldPassword,
      newPassword1,
      newPassword2,
      id: this.getUser().id
    };
    return this.apiService.changePassword(obj).subscribe(async res => {
      this.alertService.showOkayAlertWithoutAction(res.header, res.message);

    }),
      catchError(e => {
        this.alertService.showOkayAlertWithoutAction('Error', e.error.message);
        throw new Error(e);
      });
  }

  resetPassword(email) {
    return this.apiService.resetPassword(email).subscribe(async res => {
      this.alertService.showOkayAlertWithoutAction(res.header, res.message);

    }),
      catchError(e => {
        this.alertService.showOkayAlertWithoutAction('Error', e.error.message);
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
        this.alertService.showOkayAlertWithoutAction(res.header, res.message);
      }
      else {
        const alert = await this.alertController.create({
          cssClass: 'custom-alert-ok',
          backdropDismiss: false,
          header: res.header,
          message: res.message,
          buttons: [{
            text: 'Okay',
            handler: () => {
              this.router.navigate(['login']);
            }
          }]
        });
        await alert.present();
      }
    });
  }
}
