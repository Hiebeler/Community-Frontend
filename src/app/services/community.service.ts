import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, map, Observable, Subscription, tap } from 'rxjs';
import { ApiCommunity, Community } from '../models/community.model';
import { ApiService } from './api.service';
import { CommunityAdapter } from '../models/community.adapter';
import { StorageService } from './storage.service';
import { ApiUser, User } from '../models/user.model';
import { UserAdapter } from '../models/user.adapter';
import { AuthService } from './auth.service';
import { ApiResponse } from '../models/api-response';
import { ApiRequest } from '../models/request.model';

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
    private userAdapter: UserAdapter
  ) {
    this.subscriptions.push(
      this.authService.activeCommunityId.subscribe((id) => {
        if (!id) {
          this.community.next(null);
        } else {
          this.fetchCurrentCommunityFromApi(id);
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
    this.subscriptions.push(
      this.apiService
        .getCommunityById(id)
        .pipe(map((res) => this.communityAdapter.adapt(res.data)))
        .subscribe((community) => {
          this.community.next(community);
        })
    );
  }

  getCommunity(code: string): Observable<Community> {
    return this.apiService
      .getCommunityByCode(code)
      .pipe(map((res) => this.communityAdapter.adapt(res.data)));
  }

  getOwnCommunities(): Observable<ApiResponse<ApiCommunity[]>> {
    return this.apiService.getOwnCommunities();
  }

  createCommunity(name: string): Observable<ApiResponse<ApiCommunity>> {
    return this.apiService.createCommunity({ name }).pipe(
      tap((res) => {
        if (res.success) {
          this.setCurrentCommunity(res.data.id);
        }
      })
    );
  }

  joinCommunity(code: string): Observable<boolean> {
    return this.apiService.joinCommunity({ code }).pipe(
      map((res) => {
        if (res.success) {
          return true;
        } else {
          return false;
        }
      })
    );
  }

  changeAdmin(communityId: number, newAdminId: number) {
    return this.apiService.changeAdminOfCommunity(communityId, newAdminId);
  }

  leaveCommunity(id: number): Observable<ApiResponse<any>> {
    return this.apiService.leaveCommunity(id);
  }

  deleteCommunity(id: number): Observable<ApiResponse<any>> {
    return this.apiService.deleteCommunity(id);
  }

  getUsersInCurrentCommunity(): Observable<User[]> {
    return this.usersInCommunity;
  }

  getUsersInCommunity(id: number): Observable<ApiResponse<User[]>> {
    return this.apiService.getUsersInCommunity(id).pipe(
      map(
        (res) =>
          new ApiResponse<User[]>({
            ...res,
            data: res.success
              ? res.data?.map((el) => this.userAdapter.adapt(el)) ?? null
              : null,
          })
      )
    );
  }

  fetchUsersInCommunityFromApi(id: number): void {
    if (id) {
      this.subscriptions.push(
        this.apiService
          .getUsersInCommunity(id)
          .pipe(
            map((data) => data.data.map((item) => this.userAdapter.adapt(item)))
          )
          .subscribe((users) => {
            this.usersInCommunity.next(users);
          })
      );
    }
  }

  getRequests(): Observable<ApiResponse<ApiRequest[]>> {
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
          if (res.success) {
            return true;
          } else {
            return false;
          }
        })
      );
  }

  setCurrentCommunity(communityId: number): void {
    this.storageService.setCurrentCommunity(communityId);
    this.authService.activeCommunityId.next(communityId);
  }

  updateCommunityName(
    communityId: number,
    name: string
  ): Observable<ApiResponse<Community>> {
    return this.apiService.updateCommunityName(communityId, name).pipe(
      map((res: ApiResponse<ApiCommunity>) => {
        // Adapt data only if success and data exists
        const adaptedData: Community =
          res.success && res.data
            ? this.communityAdapter.adapt(res.data)
            : null;

        return new ApiResponse<Community>({
          status: res.status,
          error: res.error,
          data: adaptedData,
        });
      })
    );
  }
}
