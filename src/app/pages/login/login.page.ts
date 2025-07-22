import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
})
export class LoginPage {
  loginForm: FormGroup;

  constructor(private authService: AuthService) {
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
      this.authService.login(this.email.value, this.password.value);
    }
  }
}
