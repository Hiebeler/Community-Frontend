import { Component, OnDestroy, OnInit } from '@angular/core';
import { RequestAdapter } from 'src/app/adapter/request-adapter';
import { ApiService } from 'src/app/services/api.service';
import { Request } from 'src/app/models/request';
import { CommunityService } from 'src/app/services/community.service';
import { UserService } from 'src/app/services/user.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-open-requests',
  templateUrl: './open-requests.component.html',
  styleUrls: ['./open-requests.component.scss'],
})
export class OpenRequestsComponent implements OnInit, OnDestroy {

  subscriptions: Subscription[] = [];

  requests: Request[] = [];

  constructor(
    private communityService: CommunityService,
    private apiService: ApiService,
    private requestAdapter: RequestAdapter,
    private userService: UserService
  ) { }

  ngOnInit() {
    this.subscriptions.push(this.communityService.getCurrentCommunity().subscribe(community => {
      if (community) {
        this.getAllRequests();
      }
    }));
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  getAllRequests() {
    this.subscriptions.push(this.apiService.getRequests().subscribe((requests) => {
      if (requests.status === 'OK') {
        requests = requests.data.map((data: any) => this.requestAdapter.adapt(data));
        this.requests = requests;
        console.log(requests);
      }
    }));
  }

  accept(id: number, status: boolean) {
    this.subscriptions.push(this.apiService.acceptRequest({ id }, status).subscribe((res) => {
      if (res.status === 'OK') {
        this.getAllRequests();
        if (status) {
          this.userService.fetchUserFromApi();
        }
      }
    }));
  }
}
