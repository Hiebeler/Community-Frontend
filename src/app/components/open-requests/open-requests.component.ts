import { Component, OnDestroy, OnInit } from '@angular/core';
import { RequestAdapter } from 'src/app/models/request.adapter';
import { Request } from 'src/app/models/request.model';
import { CommunityService } from 'src/app/services/community.service';
import { UserService } from 'src/app/services/user.service';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { CheckIcon, LucideAngularModule, XIcon } from 'lucide-angular';

@Component({
  selector: 'app-open-requests',
  templateUrl: './open-requests.component.html',
  imports: [CommonModule, LucideAngularModule],
  standalone: true,
})
export class OpenRequestsComponent implements OnInit, OnDestroy {
  readonly closeIcon = XIcon;
  readonly checkmarkIcon = CheckIcon;

  subscriptions: Subscription[] = [];

  requests: Request[] = [];

  constructor(
    private communityService: CommunityService,
    private requestAdapter: RequestAdapter,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.subscriptions.push(
      this.communityService.getCurrentCommunity().subscribe((community) => {
        if (community) {
          this.getAllRequests();
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  getAllRequests() {
    this.subscriptions.push(
      this.communityService.getRequests().subscribe((requests) => {
        if (requests.success) {
          this.requests = requests.data.map((data) =>
            this.requestAdapter.adapt(data)
          );
        }
      })
    );
  }

  accept(id: number, status: boolean) {
    this.subscriptions.push(
      this.communityService
        .acceptRequest(id, status)
        .subscribe((wasSuccessful) => {
          if (wasSuccessful) {
            this.getAllRequests();
            if (status) {
              this.userService.fetchUserFromApi();
            }
          }
        })
    );
  }
}
