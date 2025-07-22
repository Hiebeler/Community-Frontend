import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { Subscription } from 'rxjs';
import { JoinCommunityComponent } from 'src/app/components/join-community/join-community.component';
import { PopupComponent } from 'src/app/components/popup/popup.component';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user.service';
import { CreateCommunityComponent } from "src/app/components/create-community/create-community.component";

@Component({
  selector: 'app-onboarding',
  templateUrl: './onboarding.component.html',
  imports: [
    PopupComponent,
    JoinCommunityComponent,
    CreateCommunityComponent
]
})
export class OnboardingComponent implements OnInit {
  subscriptions: Subscription[] = [];

  user: User;

  joinCommunityPopup = false;
  createCommunityPopup = false;

  constructor(
    private userService: UserService,
  ) { }

  ngOnInit() {
    this.subscriptions.push(this.userService.getCurrentUser().subscribe(user => {
      this.user = user;
    }));
  }

  changeJoinCommunityPopup(state: boolean) {
    this.joinCommunityPopup = state;
  }

   changeCreateCommunityPopup(state: boolean) {
    this.createCommunityPopup = state;
  }

}
