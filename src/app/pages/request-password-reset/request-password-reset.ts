import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TranslocoModule } from '@jsverse/transloco';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-request-password-reset',
  imports: [ReactiveFormsModule, TranslocoModule],
  templateUrl: './request-password-reset.html',
})
export class RequestPasswordReset {
  emailForm: FormGroup;

  sent = false;
  error = '';

  constructor(private authService: AuthService) {
    this.emailForm = new FormGroup({
      email: new FormControl<string | null>('', [
        Validators.required,
        Validators.email,
      ]),
    });
  }

  get email() {
    return this.emailForm.get('email');
  }

  onSubmit() {
    if (this.emailForm.valid) {
      this.authService
        .requestPasswordReset(this.email.value)
        .subscribe((res) => {
          if (res.success) {
            this.sent = true;
          } else {
            this.error = 'Ein Fehler ist aufgetreten';
          }
        });
    }
  }
}
