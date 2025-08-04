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
  selector: 'app-register',
  templateUrl: './register.page.html',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
})
export class RegisterPage {
  registerForm: FormGroup;

  constructor(private authService: AuthService) {
    this.registerForm = new FormGroup({
      email: new FormControl<string | null>('', [
        Validators.required,
        Validators.email,
      ]),
      name: new FormControl<string | null>('', [
        Validators.required,
        Validators.minLength(3),
      ]),
      password: new FormControl<string | null>('', [
        Validators.required,
        Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)[\S]{6,}$/),
      ]),
      password2: new FormControl<string | null>('', Validators.required),
    });
  }

  get email() {
    return this.registerForm.get('email');
  }

  get name() {
    return this.registerForm.get('name');
  }

  get password() {
    return this.registerForm.get('password');
  }

  get password2() {
    return this.registerForm.get('password2');
  }

  onSubmit() {
    if (
      this.registerForm.valid &&
      this.password.value === this.password2.value
    ) {
      this.authService.register({
        email: this.email.value,
        name: this.name.value,
        password: this.password.value,
      });
    }
  }
}
