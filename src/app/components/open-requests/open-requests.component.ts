import {
  Component,
  computed,
  effect,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import { RequestAdapter } from 'src/app/models/request.adapter';
import { Request } from 'src/app/models/request.model';
import { CommunityService } from 'src/app/services/community.service';
import { UserService } from 'src/app/services/user.service';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { CheckIcon, LucideAngularModule, XIcon } from 'lucide-angular';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-open-requests',
  templateUrl: './open-requests.component.html',
  imports: [CommonModule, LucideAngularModule],
  standalone: true,
})
export class OpenRequestsComponent {
  readonly closeIcon = XIcon;
  readonly checkmarkIcon = CheckIcon;

  subscriptions: Subscription[] = [];

  requests = signal<Request[]>([]);

  constructor(
    private communityService: CommunityService,
    private requestAdapter: RequestAdapter,
    private userService: UserService,
    private toastr: ToastrService
  ) {
    effect(() => {
      const community = this.communityService.activeCommunity();
      if (community) {
        this.fetchRequests();
      } else {
        this.requests.set([]);
      }
    });
  }

  fetchRequests() {
    this.communityService.getRequests().subscribe((res) => {
      if (res.success && res.data) {
        this.requests.set(res.data.map((r) => this.requestAdapter.adapt(r)));
      } else {
        this.requests.set([]);
      }
    });
  }

  accept(id: number, status: boolean) {
    this.communityService
      .acceptRequest(id, status)
      .subscribe((res) => {
        if (res.success) {
          this.fetchRequests();
          if (status) {
            this.toastr.success("Anfrage wurde angenommen")
          } else {
            this.toastr.success("Anfrage wurde abgelehnt")
          }
          if (status) {
            this.userService.fetchUserFromApi();
          }
        } else {
          this.toastr.error(res.error)
        }
      });
  }

  hasRequests = computed(() => this.requests().length > 0);
}
