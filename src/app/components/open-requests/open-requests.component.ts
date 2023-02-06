import { Component, OnInit } from '@angular/core';
import { RequestAdapter } from 'src/app/adapter/request-adapter';
import { ApiService } from 'src/app/services/api.service';
import { Request } from 'src/app/models/request';
import { CommunityService } from 'src/app/services/community.service';

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
    private requestAdapter: RequestAdapter
  ) { }

  ngOnInit() {

    this.communityService.getCurrentCommunity().subscribe(community => {
      if (community) {
        this.apiService.getRequests().subscribe((requests) => {
          if (requests.status === 'OK') {
            requests = requests.data.map((data: any) => this.requestAdapter.adapt(data));
            this.requests = requests;
            console.log(requests);
          }
        });
      }
    });
  }

  async accept(id: number) {
    await this.apiService.acceptRequest({ id }).subscribe((res) => {

    });
  }

}
