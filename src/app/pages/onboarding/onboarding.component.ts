import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { JoinCommunityComponent } from 'src/app/components/join-community/join-community.component';
import { PopupComponent } from 'src/app/components/popup/popup.component';
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';
import { CreateCommunityComponent } from 'src/app/components/create-community/create-community.component';
import { Community } from 'src/app/models/community.model';
import { CommunityService } from 'src/app/services/community.service';
import {
  ArrowLeftIcon,
  ArrowLeftRightIcon,
  LogOutIcon,
  LucideAngularModule,
  PenIcon,
} from 'lucide-angular';
import { Router, RouterModule } from '@angular/router';
import { Navbar } from 'src/app/components/navbar/navbar';
import { AuthService } from 'src/app/services/auth.service';
import { AlertService } from 'src/app/services/alert.service';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ProfileImageEditorComponent } from 'src/app/components/profile-image-editor/profile-image-editor.component';
import { CommunityAdapter } from 'src/app/models/community.adapter';
import { PrimaryButton } from 'src/app/components/primary-button/primary-button';

@Component({
  selector: 'app-onboarding',
  templateUrl: './onboarding.component.html',
  imports: [
    CommonModule,
    PopupComponent,
    JoinCommunityComponent,
    CreateCommunityComponent,
    ProfileImageEditorComponent,
    ReactiveFormsModule,
    LucideAngularModule,
    RouterModule,
    Navbar,
    PrimaryButton,
  ],
})
export class OnboardingComponent implements OnInit {
  readonly switchIcon = ArrowLeftRightIcon;
  readonly backIcon = ArrowLeftIcon;
  readonly logoutIcon = LogOutIcon;
  readonly penIcon = PenIcon;

  subscriptions: Subscription[] = [];

  user: User;

  activeCommunity: Community | null;

  ownCommunities: Community[] = [];

  nameUpdateEditorForm: FormGroup;
  changePasswordForm: FormGroup;

  joinCommunityPopup = false;
  createCommunityPopup = false;

  showImageUploadPopup = false;

  isLoadingPasswordChange = false;
  isLoadingNameChange = false;

  constructor(
    private userService: UserService,
    private communityService: CommunityService,
    private authService: AuthService,
    private alertService: AlertService,
    private communityAdapter: CommunityAdapter,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.nameUpdateEditorForm = new FormGroup({
      name: new FormControl<string | null>('', [
        Validators.minLength(1),
        Validators.required,
      ]),
    });

    this.changePasswordForm = new FormGroup({
      oldPassword: new FormControl<string | null>('', [
        Validators.minLength(1),
        Validators.required,
      ]),
      newPassword: new FormControl<string | null>('', [
        Validators.minLength(1),
        Validators.required,
      ]),
    });
  }

  get name() {
    return this.nameUpdateEditorForm.get('name');
  }

  get oldPassword() {
    return this.changePasswordForm.get('oldPassword');
  }

  get newPassword() {
    return this.changePasswordForm.get('newPassword');
  }

  ngOnInit() {
    this.subscriptions.push(
      this.userService.getCurrentUser().subscribe((user) => {
        this.user = user;
        this.nameUpdateEditorForm.controls.name.setValue(this.user?.name);
      })
    );

    this.subscriptions.push(
      this.communityService.getCurrentCommunity().subscribe((community) => {
        this.activeCommunity = community;
      })
    );

    this.subscriptions.push(
      this.communityService.getOwnCommunities().subscribe((res) => {
        console.log(res);
        if (res.success) {
          this.ownCommunities = res.data.map((it) =>
            this.communityAdapter.adapt(it)
          );
        }
      })
    );
  }

  changeJoinCommunityPopup(state: boolean) {
    this.joinCommunityPopup = state;
  }

  changeCreateCommunityPopup(state: boolean) {
    this.createCommunityPopup = state;
  }

  selectCommunity(community: Community) {
    this.communityService.setCurrentCommunity(community.id);
    this.toastr.success(
      `Gemeinschaft "` + community.name + `" wurde ausgewählt`
    );
    this.router.navigate(['/profile']);
  }

  updateName() {
    this.updateUser({
      name: this.name.value,
    });
  }

  updateUser(data: any) {
    this.isLoadingNameChange = true;
    this.subscriptions.push(
      this.userService.updateUser(data).subscribe((wasSuccessful) => {
        this.isLoadingNameChange = false;
        if (wasSuccessful) {
          this.userService.fetchUserFromApi();
          this.toastr.success('Name geändert');
        } else {
          this.toastr.error("Ein Fehler ist aufgetreten")
        }
      })
    );
  }

  changePassword() {
    if (this.changePasswordForm.valid) {
      this.isLoadingPasswordChange = true;
      this.authService
        .changePassword(
          this.changePasswordForm.value.oldPassword,
          this.changePasswordForm.value.newPassword
        )
        .subscribe((res) => {
          this.isLoadingPasswordChange = false;
          if (res.success) {
            this.toastr.success('Passwort wurde geändert');
          } else {
            this.toastr.error(res.error);
          }
        });
    }
  }

  openLogoutPopup() {
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
}
