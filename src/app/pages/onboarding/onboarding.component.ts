import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { JoinCommunityComponent } from 'src/app/components/join-community/join-community.component';
import { PopupComponent } from 'src/app/components/popup/popup.component';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user.service';
import { CreateCommunityComponent } from 'src/app/components/create-community/create-community.component';
import { Community } from 'src/app/models/community';
import { CommunityService } from 'src/app/services/community.service';
import { ArrowLeftRightIcon, LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-onboarding',
  templateUrl: './onboarding.component.html',
  imports: [
    PopupComponent,
    JoinCommunityComponent,
    CreateCommunityComponent,
    LucideAngularModule,
  ],
})
export class OnboardingComponent implements OnInit {
  readonly switchIcon = ArrowLeftRightIcon;

  subscriptions: Subscription[] = [];

  user: User;

  communities: Community[] = [];
  activeCommunity: Community | null;

  joinCommunityPopup = false;
  createCommunityPopup = false;

  constructor(
    private userService: UserService,
    private communityService: CommunityService
  ) {}

  ngOnInit() {
    this.subscriptions.push(
      this.userService.getCurrentUser().subscribe((user) => {
        this.user = user;
      })
    );

    this.subscriptions.push(
      this.communityService.getOwnCommunities().subscribe((communities) => {
        this.communities = communities;
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
  }
}
