import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, map, Observable, Subscription } from 'rxjs';
import { Community } from '../models/community';
import { Request } from 'src/app/models/request';
import { ApiService } from './api.service';
import { UserService } from './user.service';
import { CommunityAdapter } from '../adapter/community-adapter';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class CommunityService implements OnDestroy {

  subscriptions: Subscription[] = [];

  private community = new BehaviorSubject<Community>(null);

  constructor(
    private apiService: ApiService,
    private userService: UserService,
    private communityAdapter: CommunityAdapter,
    private storageService: StorageService
  ) {
    this.subscriptions.push(this.userService.getCurrentUser().subscribe(user => {
      if (user && (user?.communityId !== this.community.value?.id)) {
        this.fetchCurrentCommunityFromApi(user.communities);
      }
    }));
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  getCurrentCommunity(): Observable<Community | null> {
    return this.community;
  }

  fetchCurrentCommunityFromApi(communities: Community[]): void {
    /*this.subscriptions.push(this.apiService.getCommunityById(id ?? this.community?.value?.id ?? -1).pipe(
      map(res => this.communityAdapter.adapt(res.data))
    ).subscribe(community => {
      this.community.next(community);
    }));*/
    console.log('get current community');
    if (communities.length === 0) {
      return;
    }
    let currentCommunityId = this.storageService.getCurrentCommunity();
    if (!currentCommunityId) {
      const firstCommunityId = communities[0].id;
      this.storageService.setCurrentCommunity(firstCommunityId);
      currentCommunityId = firstCommunityId;
    }
    console.log(currentCommunityId);
    const currentCommunity = communities.find((community: Community) => community.id === currentCommunityId);
    this.userService.fetchUsersInCommunityFromApi(currentCommunity.id);
    this.community.next(currentCommunity);
  }

  getCommunity(code: string): Observable<Community> {
    return this.apiService.getCommunityByCode(code).pipe(
      map(res => this.communityAdapter.adapt(res.data))
    );
  }

  createCommunity(name: string): Observable<boolean> {
    return this.apiService.createCommunity({ name }).pipe(
      map(res => {
        if (res.status === 'OK') {
          return true;
        } else {
          return false;
        }
      }));
  }

  joinCommunity(code: string): Observable<boolean> {
    return this.apiService.joinCommunity({ code }).pipe(
      map(res => {
        if (res.status === 'OK') {
          return true;
        } else {
          return false;
        }
      }));
  }

  getRequests(): Observable<any> {
    return this.apiService.getRequests();
  }

  acceptRequest(requestId: number, acceptionStatus: boolean): Observable<boolean> {
    return this.apiService.acceptRequest({ id: requestId }, acceptionStatus).pipe(
      map(res => {
        if (res.status === 'OK') {
          return true;
        } else {
          return false;
        }
      }));
  }

  clearData(): void {
    this.community.next(null);
  }

  setCurrentCommunity(): void {

  }
}
