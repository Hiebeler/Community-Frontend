import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { JoinCommunityComponent } from 'src/app/components/join-community/join-community.component';
import { PopupComponent } from 'src/app/components/popup/popup.component';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user.service';
import { CreateCommunityComponent } from 'src/app/components/create-community/create-community.component';
import { Community } from 'src/app/models/community';
import { CommunityService } from 'src/app/services/community.service';
import {
  ArrowLeftIcon,
  ArrowLeftRightIcon,
  LogOutIcon,
  LucideAngularModule,
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

@Component({
  selector: 'app-onboarding',
  templateUrl: './onboarding.component.html',
  imports: [
    CommonModule,
    PopupComponent,
    JoinCommunityComponent,
    CreateCommunityComponent,
    ReactiveFormsModule,
    LucideAngularModule,
    RouterModule,
    Navbar,
  ],
})
export class OnboardingComponent implements OnInit {
  readonly switchIcon = ArrowLeftRightIcon;
  readonly backIcon = ArrowLeftIcon;
  readonly logoutIcon = LogOutIcon;

  subscriptions: Subscription[] = [];

  user: User;

  activeCommunity: Community | null;

  nameUpdateEditorForm: FormGroup;

  joinCommunityPopup = false;
  createCommunityPopup = false;

  constructor(
    private userService: UserService,
    private communityService: CommunityService,
    private authService: AuthService,
    private alertService: AlertService,
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
        this.nameUpdateEditorForm.controls.name.setValue(this.user?.name);
      })
    );

    this.subscriptions.push(
      this.communityService.getCurrentCommunity().subscribe((community) => {
        this.activeCommunity = community;
      })
    );
  }

  changeJoinCommunityPopup(state: boolean) {
    this.joinCommunityPopup = state;
  }

  changeCreateCommunityPopup(state: boolean) {
    this.createCommunityPopup = state;
  }

  selectCommunity(communityId: number) {
    this.communityService.setCurrentCommunity(communityId);
    this.router.navigate(['/profile']);
  }

  updateName() {
    this.updateUser({
      name: this.name.value,
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
