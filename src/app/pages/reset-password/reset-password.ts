import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-reset-password',
  imports: [ReactiveFormsModule],
  templateUrl: './reset-password.html',
})
export class ResetPassword implements OnInit {
  resetForm: FormGroup;

  code: string | null = '';

  constructor(
    private authService: AuthService,
    private activatedRoute: ActivatedRoute
  ) {
    this.resetForm = new FormGroup({
      password: new FormControl<string | null>('', [Validators.required]),
    });
  }

  get password() {
    return this.resetForm.get('password');
  }

  ngOnInit() {
    this.code = this.activatedRoute.snapshot.paramMap.get('code');
    //this.authService.verify(this.code);
  }

  onSubmit() {
    if (this.resetForm.valid) {
      this.authService
        .resetPassword(this.password.value)
        .subscribe((res) => {
          if (res.status === 'OK') {
          }
        });
    }
  }
}
