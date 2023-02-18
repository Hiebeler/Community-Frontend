import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage {

  registerForm: FormGroup;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = new FormGroup({
      email: new FormControl<string | null>('', [Validators.required, Validators.email]),
      firstname: new FormControl<string | null>('', [Validators.required, Validators.minLength(3)]),
      lastname: new FormControl<string | null>('', [Validators.required, Validators.minLength(3)]),
      password: new FormControl<string | null>('', [Validators.required, Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)[\S]{6,}$/)]),
      password2: new FormControl<string | null>('', Validators.required)
    });
  }

  get email() {
    return this.registerForm.get('email');
  }

  get firstname() {
    return this.registerForm.get('firstname');
  }

  get lastname() {
    return this.registerForm.get('lastname');
  }

  get password() {
    return this.registerForm.get('password');
  }

  get password2() {
    return this.registerForm.get('password2');
  }

  onSubmit() {
    if (this.registerForm.valid && this.password.value === this.password2.value) {
      this.authService.register(this.email.value, this.firstname.value, this.lastname.value, this.password.value);
    }
  }

  gotoLogin() {
    this.router.navigate(['login']);
  }
}
