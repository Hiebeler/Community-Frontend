import { Component, signal } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { CommunityService } from 'src/app/services/community.service';
import { RouterModule } from '@angular/router';
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
export class ProfilePage {
  readonly paletteIcon = PaletteIcon;
  readonly userPen = UserPenIcon;
  readonly switchIcon = ArrowLeftRightIcon;
  readonly logoutIcon = LogOutIcon;

  feedbackForm = new FormGroup({
    feedback: new FormControl<string | null>('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(1000),
    ]),
  });

  feedbackPopupIsOpen = signal(false);
  isSendingFeedback = signal(false);

  user = this.userService.user;
  community = this.communityService.activeCommunity;
  usersInCommunity = this.communityService.usersInActiveCommunity;

  constructor(
    private authService: AuthService,
    private alertService: AlertService,
    private userService: UserService,
    private communityService: CommunityService,
    private toastr: ToastrService
  ) {}

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
    this.feedbackPopupIsOpen.set(true);
  }

  sendFeedback() {
    this.isSendingFeedback.set(true);
    this.userService
      .sendFeedback(this.feedbackForm.controls.feedback.value)
      .subscribe((res) => {
        this.isSendingFeedback.set(false);
        if (res.success) {
          this.toastr.success('Feedback gesendet!');
          this.feedbackPopupIsOpen.set(false);
        } else {
          this.toastr.error(res.error);
        }
      });
  }
}
