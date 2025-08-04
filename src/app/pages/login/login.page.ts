import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PrimaryButton } from 'src/app/components/primary-button/primary-button';
import { AlertService } from 'src/app/services/alert.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  imports: [CommonModule, ReactiveFormsModule, RouterModule, PrimaryButton],
})
export class LoginPage {

  loginForm: FormGroup;

  isLoading = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService,
    private alertService: AlertService
  ) {
    this.loginForm = new FormGroup({
      email: new FormControl<string | null>('', Validators.required),
      password: new FormControl<string | null>('', Validators.required),
    });
  }

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.authService
        .login(this.email.value, this.password.value)
        .subscribe((res) => {
          this.isLoading = false;
          if (res.success) {
            this.router.navigate(['/onboarding']);
            this.toastr.success('Willkommen zurück!');
          } else if (res.data?.verified === false) {
            this.alertService.showAlert(
              'Nicht verifiziert',
              res.error,
              'Erneut senden',
              () =>
                this.authService
                  .resendVerificationEmail(this.email.value)
                  .subscribe(async (res) => {
                    if (res.success) {
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
          } else {
            this.alertService.showAlert('Oops', res.error);
          }
        });
    }
  }
}
