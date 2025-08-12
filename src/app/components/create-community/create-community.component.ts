import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { CommunityService } from 'src/app/services/community.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-create-community',
  templateUrl: './create-community.component.html',
  imports: [ReactiveFormsModule],
})
export class CreateCommunityComponent implements OnInit {
  subscriptions: Subscription[] = [];

  communityForm: FormGroup;

  constructor(
    private userService: UserService,
    private communityService: CommunityService,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.communityForm = new FormGroup({
      name: new FormControl<string | null>('', [
        Validators.required,
        Validators.minLength(3),
      ]),
    });
  }

  ngOnInit() {}

  get name() {
    return this.communityForm.get('name');
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  createCommunity() {
    if (this.communityForm.valid) {
      this.subscriptions.push(
        this.communityService
          .createCommunity(this.name.value)
          .subscribe((res) => {
            if (res.success) {
              this.toastr.success(
                'Gemeinschaft ' + res.data.name + ' wurde erstellt'
              );
              this.userService.fetchUserFromApi();
              this.router.navigate(['profile']);
            } else {
              this.toastr.error(res.error);
            }
          })
      );
    }
  }
}
