import { Component, OnDestroy, OnInit } from '@angular/core';
import { Community } from 'src/app/models/community.model';
import { User } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { CommunityService } from 'src/app/services/community.service';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { OpenRequestsComponent } from 'src/app/components/open-requests/open-requests.component';
import {
  ArrowLeftRightIcon,
  LogOutIcon,
  LucideAngularModule,
  PaletteIcon,
  UserPenIcon,
} from 'lucide-angular';
import { Navbar } from 'src/app/components/navbar/navbar';
import { AlertService } from 'src/app/services/alert.service';
import { PopupComponent } from 'src/app/components/popup/popup.component';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { PrimaryButton } from 'src/app/components/primary-button/primary-button';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  imports: [
    CommonModule,
    RouterModule,
    OpenRequestsComponent,
    LucideAngularModule,
    ReactiveFormsModule,
    PrimaryButton,
    Navbar,
    PopupComponent,
  ],
})
export class ProfilePage implements OnInit, OnDestroy {
  readonly paletteIcon = PaletteIcon;
  readonly userPen = UserPenIcon;
  readonly switchIcon = ArrowLeftRightIcon;
  readonly logoutIcon = LogOutIcon;

  subscriptions: Subscription[] = [];

  feedbackForm: FormGroup;
  feedbackPopupIsOpen = false;
  isSendingFeedback = false;

  user: User;
  community: Community;
  usersInCommunity: User[];

  constructor(
    private authService: AuthService,
    private alertService: AlertService,
    private userService: UserService,
    private communityService: CommunityService,
    private toastr: ToastrService
  ) {
    this.feedbackForm = new FormGroup({
      feedback: new FormControl<string | null>('', [
        Validators.required,
        Validators.maxLength(500),
      ]),
    });
  }

  ngOnInit() {
    this.subscriptions.push(
      this.userService.getCurrentUser().subscribe((user) => {
        this.user = user;
      })
    );

    this.subscriptions.push(
      this.communityService.getCurrentCommunity().subscribe((community) => {
        this.community = community;
      })
    );

    this.subscriptions.push(
      this.communityService.getUsersInCurrentCommunity().subscribe((users) => {
        this.usersInCommunity = users;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  updateUser(data: any) {
    this.subscriptions.push(
      this.userService.updateUser(data).subscribe((wasSuccessful) => {
        if (wasSuccessful) {
          this.userService.fetchUserFromApi();
        }
      })
    );
  }

  logout() {
    this.alertService.showAlert(
      'Abmelden?',
      'Sicher dass du dich abmelden willst?',
      'Abmelden',
      () => {
        this.authService.logout();
      },
      'Cancel'
    );
  }

  openFeedbackPopup() {
    this.feedbackForm.controls.feedback.setValue('');
    this.feedbackPopupIsOpen = true;
  }

  sendFeedback() {
    this.isSendingFeedback = true;
    this.userService
      .sendFeedback(this.feedbackForm.controls.feedback.value)
      .subscribe((res) => {
        this.isSendingFeedback = false;
        if (res.success) {
          this.toastr.success('Feedback gesendet!');
          this.feedbackPopupIsOpen = false;
        } else {
          this.toastr.error(res.error);
        }
      });
  }
}
