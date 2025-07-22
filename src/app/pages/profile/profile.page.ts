import { Component, OnDestroy, OnInit } from '@angular/core';
import { Community } from 'src/app/models/community';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { AlertService } from 'src/app/services/alert.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommunityService } from 'src/app/services/community.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ProfileImageEditorComponent } from 'src/app/components/profile-image-editor/profile-image-editor.component';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ColorEditorComponent } from 'src/app/components/color-editor/color-editor.component';
import { OpenRequestsComponent } from 'src/app/components/open-requests/open-requests.component';
import { LucideAngularModule, PaletteIcon } from 'lucide-angular';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.page.html',
    standalone: true,
    imports: [
      CommonModule,
      IonicModule,
      ReactiveFormsModule,
      ColorEditorComponent,
      ProfileImageEditorComponent,
      OpenRequestsComponent,
      LucideAngularModule
    ]
})
export class ProfilePage implements OnInit, OnDestroy {
  readonly paletteIcon = PaletteIcon;

  subscriptions: Subscription[] = [];

  user: User;
  community: Community;
  usersInCommunity: User[];

  editingImage = false;
  editingColor = false;
  editingName = false;

  nameUpdateEditorForm: FormGroup;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private communityService: CommunityService,
    private alertService: AlertService,
    private router: Router
  ) {
    this.nameUpdateEditorForm = new FormGroup({
      firstname: new FormControl<string | null>('', [Validators.minLength(1), Validators.required]),
      lastname: new FormControl<string | null>('', [Validators.minLength(1), Validators.required])
    });
  }

  get firstname() {
    return this.nameUpdateEditorForm.get('firstname');
  }

  get lastname() {
    return this.nameUpdateEditorForm.get('lastname');
  }

  ngOnInit() {
    this.subscriptions.push(this.userService.getCurrentUser().subscribe(user => {
      this.user = user;
    }));

    this.subscriptions.push(this.communityService.getCurrentCommunity().subscribe(community => {
      this.community = community;
    }));

    this.subscriptions.push(this.userService.getUsersInCurrentCommunity().subscribe(users => {
      this.usersInCommunity = users;
    }));
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  toggleNameEditor() {
    if (!this.editingName) {
      this.nameUpdateEditorForm.controls.firstname.setValue(this.user.firstname);
      this.nameUpdateEditorForm.controls.lastname.setValue(this.user.lastname);
    }
    this.editingName = !this.editingName;
  }

  updateName() {
    this.updateUser({ firstname: this.firstname.value, lastname: this.lastname.value });
  }

  updateUser(data: any) {
    this.subscriptions.push(this.userService.updateUser(data).subscribe(wasSuccessful => {
      if (wasSuccessful) {
        this.userService.fetchUserFromApi();
      }
    }));
  }

  async logout() {
    this.alertService.showAlert(
      'Bist du dir sicher?',
      '',
      'Logout',
      this.authService.logout.bind(this.authService),
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

}
