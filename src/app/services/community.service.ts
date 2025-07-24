import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, map, Observable, Subscription } from 'rxjs';
import { Community } from '../models/community';
import { ApiService } from './api.service';
import { UserService } from './user.service';
import { CommunityAdapter } from '../adapter/community-adapter';
import { StorageService } from './storage.service';
import { User } from '../models/user';
import { UserAdapter } from '../adapter/user-adapter';

@Injectable({
  providedIn: 'root',
})
export class CommunityService implements OnDestroy {
  subscriptions: Subscription[] = [];

  private community = new BehaviorSubject<Community>(null);
  private usersInCommunity = new BehaviorSubject<User[]>([]);

  constructor(
    private apiService: ApiService,
    private communityAdapter: CommunityAdapter,
    private storageService: StorageService,
    private userAdapter: UserAdapter,
    private userService: UserService
  ) {
    this.subscriptions.push(
      this.userService.getCurrentUser().subscribe((user) => {
        console.table(user);
        if (user && user.communities.length > 0) {
          this.fetchCurrentCommunityFromApi(user.communities);
        }
      })
    );

    this.subscriptions.push(
      this.getCurrentCommunity().subscribe((community) => {
        if (community) {
          this.fetchUsersInCommunityFromApi(community.id);
        }
      })
    );
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
    if (communities.length === 0) {
      return;
    }
    let currentCommunityId = this.storageService.getCurrentCommunity();
    if (!currentCommunityId) {
      const firstCommunityId = communities[0].id;
      this.storageService.setCurrentCommunity(firstCommunityId);
      currentCommunityId = firstCommunityId;
    }
    const currentCommunity = communities.find(
      (community: Community) => community.id === currentCommunityId
    );
    this.fetchUsersInCommunityFromApi(currentCommunity.id);
    this.community.next(currentCommunity);
  }

  getCommunity(code: string): Observable<Community> {
    return this.apiService
      .getCommunityByCode(code)
      .pipe(map((res) => this.communityAdapter.adapt(res.data)));
  }

  createCommunity(name: string): Observable<boolean> {
    return this.apiService.createCommunity({ name }).pipe(
      map((res) => {
        if (res.status === 'OK') {
          this.setCurrentCommunity(res.data.id);
          return true;
        } else {
          return false;
        }
      })
    );
  }

  joinCommunity(code: string): Observable<boolean> {
    return this.apiService.joinCommunity({ code }).pipe(
      map((res) => {
        if (res.status === 'OK') {
          return true;
        } else {
          return false;
        }
      })
    );
  }

  getUsersInCurrentCommunity(): Observable<User[]> {
    return this.usersInCommunity;
  }

  fetchUsersInCommunityFromApi(id: number): void {
    if (id) {
      this.subscriptions.push(
        this.apiService
          .getUsersInCommunity(id)
          .pipe(
            map((data: any) =>
              data.data.map((item) => this.userAdapter.adapt(item))
            )
          )
          .subscribe((users) => {
            this.usersInCommunity.next(users);
          })
      );
    }
  }

  getRequests(): Observable<any> {
    return this.apiService.getRequests();
  }

  acceptRequest(
    requestId: number,
    acceptionStatus: boolean
  ): Observable<boolean> {
    return this.apiService
      .acceptRequest({ id: requestId }, acceptionStatus)
      .pipe(
        map((res) => {
          if (res.status === 'OK') {
            return true;
          } else {
            return false;
          }
        })
      );
  }

  clearData(): void {
    this.community.next(null);
  }

  setCurrentCommunity(communityId: number): void {
    this.storageService.setCurrentCommunity(communityId);
    this.userService.getCurrentUser().subscribe((user) => {
      if (user) {
        this.fetchCurrentCommunityFromApi(user.communities);
      }
    });
  }
}
