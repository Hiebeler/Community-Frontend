import { Component, OnInit } from '@angular/core';
import { RequestAdapter } from 'src/app/adapter/request-adapter';
import { ApiService } from 'src/app/services/api.service';
import { Request } from 'src/app/models/request';
import { CommunityService } from 'src/app/services/community.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-open-requests',
  templateUrl: './open-requests.component.html',
  styleUrls: ['./open-requests.component.scss'],
})
export class OpenRequestsComponent implements OnInit {

  requests: Request[] = [];

  constructor(
    private communityService: CommunityService,
    private apiService: ApiService,
    private requestAdapter: RequestAdapter,
    private userService: UserService
  ) { }

  ngOnInit() {

    this.communityService.getCurrentCommunity().subscribe(community => {
      if (community) {
        this.getAllRequests();
      }
    });
  }

  getAllRequests() {
    this.apiService.getRequests().subscribe((requests) => {
      if (requests.status === 'OK') {
        requests = requests.data.map((data: any) => this.requestAdapter.adapt(data));
        this.requests = requests;
        console.log(requests);
      }
    });
  }


  accept(id: number, status: boolean) {
    this.apiService.acceptRequest({ id }, status).subscribe((res) => {
      if (res.status === 'OK') {
        this.getAllRequests();
        if (status) {
          this.userService.fetchUserFromApi();
        }
      }
    });
  }
}
