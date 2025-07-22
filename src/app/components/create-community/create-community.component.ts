import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AlertService } from 'src/app/services/alert.service';
import { AuthService } from 'src/app/services/auth.service';
import { CommunityService } from 'src/app/services/community.service';
import { StorageService } from 'src/app/services/storage.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-create-community',
  templateUrl: './create-community.component.html',
  standalone: true,
  imports: [
    ReactiveFormsModule
  ]
})
export class CreateCommunityComponent  implements OnInit {

  subscriptions: Subscription[] = [];

  communityForm: FormGroup;

  constructor(
    private alertService: AlertService,
    private userService: UserService,
    private authService: AuthService,
    private communityService: CommunityService,
    private router: Router
  ) {
    this.communityForm = new FormGroup({
      name: new FormControl<string | null>('', [Validators.required, Validators.minLength(3)])
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
      this.subscriptions.push(this.communityService.createCommunity(this.name.value).subscribe(wasSuccessful => {
        if (!wasSuccessful) {
          this.alertService.showAlert('Error', 'Beim Erstellen der Community ist ein Fehler aufgetreten.');
        } else {
          this.authService.requestNewToken()
          this.alertService.showAlert('Community erstellt', '', 'Okay', () => {
            this.userService.fetchUserFromApi();
            this.router.navigate(['profile']);
          });
        }
      }));
    }
  }

  gotoProfile() {
    this.router.navigate(['profile']);
  }

}
