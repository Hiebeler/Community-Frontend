import { Component, OnDestroy, OnInit } from '@angular/core';
import { Community } from 'src/app/models/community';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommunityService } from 'src/app/services/community.service';
import { Router, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { ProfileImageEditorComponent } from 'src/app/components/profile-image-editor/profile-image-editor.component';
import { CommonModule } from '@angular/common';
import { ColorEditorComponent } from 'src/app/components/color-editor/color-editor.component';
import { OpenRequestsComponent } from 'src/app/components/open-requests/open-requests.component';
import {
  ArrowLeftRightIcon,
  LogOutIcon,
  LucideAngularModule,
  PaletteIcon,
  UserPenIcon,
} from 'lucide-angular';
import { PopupComponent } from 'src/app/components/popup/popup.component';
import { Navbar } from 'src/app/components/navbar/navbar';
import { AlertService } from 'src/app/services/alert.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    ColorEditorComponent,
    ProfileImageEditorComponent,
    OpenRequestsComponent,
    LucideAngularModule,
    PopupComponent,
    Navbar
  ],
})
export class ProfilePage implements OnInit, OnDestroy {
  readonly paletteIcon = PaletteIcon;
  readonly userPen = UserPenIcon;
  readonly switchIcon = ArrowLeftRightIcon;
  readonly logoutIcon = LogOutIcon;

  subscriptions: Subscription[] = [];

  user: User;
  community: Community;
  usersInCommunity: User[];
  communitiesOfUser: Community[];

  editingImage = false;
  editingColor = false;
  editingName = false;

  nameUpdateEditorForm: FormGroup;

  constructor(
    private authService: AuthService,
    private alertService: AlertService,
    private userService: UserService,
    private communityService: CommunityService,
    private router: Router
  ) {
    this.nameUpdateEditorForm = new FormGroup({
      name: new FormControl<string | null>('', [
        Validators.minLength(1),
        Validators.required,
      ]),
    });
  }

  get name() {
    return this.nameUpdateEditorForm.get('name');
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

  toggleNameEditor() {
    if (!this.editingName) {
      this.nameUpdateEditorForm.controls.name.setValue(
        this.user.name
      );
    }
    this.editingName = !this.editingName;
  }

  updateName() {
    this.updateUser({
      name: this.name.value
    });
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

  editImage(state: boolean) {
    this.editingImage = state;
  }

  editColor(state: boolean) {
    this.editingColor = state;
  }

  gotoCreateCommunity() {
    this.router.navigate(['create-community']);
  }

  gotoFindCommunity() {
    this.router.navigate(['find-community']);
  }

  gotoOnboarding() {
    this.router.navigate(['onboarding']);
  }
}
