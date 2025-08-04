import { Injectable, OnDestroy } from '@angular/core';
import {
  BehaviorSubject,
  map,
  Observable,
  Subscription,
} from 'rxjs';
import { Community } from '../models/community.model';
import { ApiService } from './api.service';
import { CommunityAdapter } from '../models/community.adapter';
import { StorageService } from './storage.service';
import { User } from '../models/user.model';
import { UserAdapter } from '../models/user.adapter';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class CommunityService implements OnDestroy {
  subscriptions: Subscription[] = [];

  private community = new BehaviorSubject<Community>(null);
  private usersInCommunity = new BehaviorSubject<User[]>([]);

  constructor(
    private apiService: ApiService,
    private authService: AuthService,
    private communityAdapter: CommunityAdapter,
    private storageService: StorageService,
    private userAdapter: UserAdapter,
  ) {
    this.subscriptions.push(
      this.authService.activeCommunityId.subscribe((id) => {
        if (!id) {
          this.community.next(null);
        } else {
          this.fetchCurrentCommunityFromApi(id)
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

  fetchCurrentCommunityFromApi(id: number): void {
    this.subscriptions.push(this.apiService.getCommunityById(id).pipe(
      map(res => this.communityAdapter.adapt(res.data))
    ).subscribe(community => {
      this.community.next(community);
    }));
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

  setCurrentCommunity(communityId: number): void {
    this.storageService.setCurrentCommunity(communityId);
    this.authService.activeCommunityId.next(communityId)
  }
}
