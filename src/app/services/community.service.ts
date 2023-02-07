import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { Community } from '../models/community';
import { ApiService } from './api.service';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class CommunityService implements OnDestroy {

  subscriptions: Subscription[] = [];

  private community = new BehaviorSubject<Community>(null);

  constructor(
    private apiService: ApiService,
    private userService: UserService
  ) {
    this.subscriptions.push(this.userService.getCurrentUser().subscribe(user => {
      if (user && (user?.communityId !== this.community.value?.id)) {
        this.fetchCurrentCommunityFromApi(user.communityId);
      }
    }));
   }

   ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  getCurrentCommunity(): Observable<Community | null> {
    return this.community;
  }

  fetchCurrentCommunityFromApi(id?: number): void {
    this.subscriptions.push(this.apiService.getCommunityById(id ?? this.community?.value?.id ?? -1).subscribe(community => {
      this.community.next(community);
    }));
  }

  clearData(): void {
    this.community.next(null);
  }
}
