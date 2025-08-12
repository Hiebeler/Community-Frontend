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
  SettingsIcon,
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
  readonly settingsIcon = SettingsIcon;

  subscriptions: Subscription[] = [];

  user: User;

  activeCommunity: Community | null;

  ownCommunities: Community[] = [];

  nameUpdateEditorForm: FormGroup;
  communityNameUpdateEditorForm: FormGroup;
  changePasswordForm: FormGroup;

  joinCommunityPopup = false;
  createCommunityPopup = false;

  showImageUploadPopup = false;

  communityToEdit: Community | null = null;
  adminCandidates: User[] = [];
  isChangeAdminOpen = false;
  isLoadingPasswordChange = false;
  isLoadingNameChange = false;
  isLoadingCommunityNameChange = false;

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

    this.communityNameUpdateEditorForm = new FormGroup({
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

  get communityName() {
    return this.communityNameUpdateEditorForm.get('name');
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

    this.fetchActiveCommunity();
    this.fetchCommunities();
  }

  fetchActiveCommunity() {
    this.subscriptions.push(
      this.communityService.getCurrentCommunity().subscribe((community) => {
        this.activeCommunity = community;
      })
    );
  }

  fetchCommunities() {
    this.subscriptions.push(
      this.communityService.getOwnCommunities().subscribe((res) => {
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

  openCommuitySettings(community: Community | null) {
    this.communityNameUpdateEditorForm.controls.name.setValue(community?.name);
    this.communityToEdit = community;
    if (community != null) {
      this.communityService
        .getUsersInCommunity(community.id)
        .subscribe((res) => {
          if (res.success) {
            this.adminCandidates = res.data.filter(
              (el) => el.id !== this.user.id
            );
          }
        });
    } else {
      this.adminCandidates = [];
    }
  }

  updateCommunityName() {
    this.isLoadingCommunityNameChange = true;
    this.subscriptions.push(
      this.communityService
        .updateCommunityName(this.communityToEdit.id, this.communityName.value)
        .subscribe((res) => {
          this.isLoadingCommunityNameChange = false;
          if (res.success) {
            this.communityNameUpdateEditorForm.controls.name.setValue(
              res.data.name
            );
            this.communityToEdit.name = res.data.name;
            this.fetchCommunities();
            this.toastr.success('Name geändert');
          } else {
            this.toastr.error(res.error);
          }
        })
    );
  }

  changeAdmin(community: Community, newAdmin: User) {
    this.alertService.showAlert(
      'Bist du dir sicher',
      'Sicher dass du dir sicher dass du die Adminrolle an ' +
        newAdmin.name +
        ' weitergeben willst?',
      'Weitergeben',
      () => {
        this.communityService
          .changeAdmin(community.id, newAdmin.id)
          .subscribe((res) => {
            if (res.success) {
              this.toastr.success(newAdmin.name + ' ist jetzt Admin.');
              this.fetchCommunities();
            } else {
              this.toastr.error(res.error);
            }
          });
      },
      'Abbrechen'
    );
  }

  requestToLeaveCommunity(community: Community) {
    this.alertService.showAlert(
      'Gemeinschaft ' + community.name + ' verlassen?',
      'Sicher dass du diese Gemeinschaft verlassen willst?',
      'Verlassen',
      () => {
        this.communityService.leaveCommunity(community.id).subscribe((res) => {
          if (res.success) {
            this.toastr.success(
              'Gemeinschaft ' + community.name + ' wurde verlassen.'
            );
            this.openCommuitySettings(null);
            this.fetchCommunities();
            if (community.id == this.activeCommunity.id) {
              this.communityService.setCurrentCommunity(null);
              this.fetchActiveCommunity();
            }
          } else {
            this.toastr.error(res.error);
          }
        });
      },
      'Abbrechen'
    );
  }

  requestToDeleteCommunity(community: Community) {
    this.alertService.showAlert(
      'Gemeinschaft ' + community.name + ' löschen?',
      'Sicher dass du diese Gemeinschaft löschen willst?',
      'Löschen',
      () => {
        this.communityService.deleteCommunity(community.id).subscribe((res) => {
          if (res.success) {
            this.toastr.success(
              'Gemeinschaft ' + community.name + ' wurde gelöscht.'
            );
            this.openCommuitySettings(null);
            this.fetchCommunities();
            if (community.id == this.activeCommunity.id) {
              this.communityService.setCurrentCommunity(null);
              this.fetchActiveCommunity();
            }
          } else {
            this.toastr.error(res.error);
          }
        });
      },
      'Abbrechen'
    );
  }

  requestToDeleteAccount() {
    this.alertService.showAlert(
      'Account löschen?',
      'Willst du deinen Account wirklich löschen?',
      'Löschen',
      () => {
        this.userService.deleteUser().subscribe((res) => {
          if (res.success) {
            this.toastr.success('Account wurde gelöscht.');
            this.openCommuitySettings(null);
            this.authService.logout();
          } else {
            this.toastr.error(res.error);
          }
        });
      },
      'Abbrechen'
    );
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
          this.toastr.error('Ein Fehler ist aufgetreten');
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
