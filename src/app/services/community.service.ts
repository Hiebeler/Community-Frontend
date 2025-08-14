import { effect, Injectable, signal } from '@angular/core';
import { map, Observable, tap } from 'rxjs';
import { ApiCommunity, Community } from '../models/community.model';
import { ApiService } from './api.service';
import { CommunityAdapter } from '../models/community.adapter';
import { StorageService } from './storage.service';
import { User } from '../models/user.model';
import { UserAdapter } from '../models/user.adapter';
import { AuthService } from './auth.service';
import { ApiResponse } from '../models/api-response';
import { ApiRequest } from '../models/request.model';

@Injectable({
  providedIn: 'root',
})
export class CommunityService {
  activeCommunity = signal<Community | null>(null);
  usersInActiveCommunity = signal<User[]>([]);
  myCommunities = signal<Community[]>([]);

  constructor(
    private apiService: ApiService,
    private authService: AuthService,
    private communityAdapter: CommunityAdapter,
    private storageService: StorageService,
    private userAdapter: UserAdapter
  ) {
    // Automatically fetch community whenever activeCommunityId changes
    effect(() => {
      const communityId = this.authService.activeCommunityId();
      if (!communityId) {
        this.activeCommunity.set(null);
        this.usersInActiveCommunity.set([]);
      } else {
        this.fetchCurrentCommunityFromApi(communityId);
      }
    });

    // Automatically fetch users when community signal updates
    effect(() => {
      const comm = this.activeCommunity();
      if (comm) {
        this.fetchUsersInCommunityFromApi(comm.id);
      } else {
        this.usersInActiveCommunity.set([]);
      }
    });
  }

  private fetchCurrentCommunityFromApi(id: number) {
    this.apiService
      .getCommunityById(id)
      .pipe(map((res) => this.communityAdapter.adapt(res.data)))
      .subscribe((community) => this.activeCommunity.set(community));
  }

  getCommunity(code: string): Observable<Community> {
    return this.apiService
      .getCommunityByCode(code)
      .pipe(map((res) => this.communityAdapter.adapt(res.data)));
  }

  fetchOwnCommunities() {
    this.apiService.getOwnCommunities().subscribe((res) => {
      if (res.success) {
        const comm = res.data.map((it) => this.communityAdapter.adapt(it));

        this.myCommunities.set(comm);
      }
    });
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
    return this.apiService.changeAdminOfCommunity(communityId, newAdminId).pipe(
      map((res) => {
        const apiResponse = new ApiResponse<Community>({
          ...res,
          data: res.success ? this.communityAdapter.adapt(res.data) : null,
        });
        if (res.success) {
          this.myCommunities.update((communities) =>
            communities.map((c) =>
              c.id === communityId ? apiResponse.data : c
            )
          );
        }

        return apiResponse;
      })
    );
  }

  leaveCommunity(id: number): Observable<ApiResponse<any>> {
    return this.apiService.leaveCommunity(id).pipe(
      map((res) => {
        if (res.success) {
          this.myCommunities.update((communities) =>
            communities.filter((c) => c.id !== id)
          );

          if (id === this.activeCommunity()?.id) {
            this.setCurrentCommunity(null);
          }
        }
        return res;
      })
    );
  }

  deleteCommunity(id: number): Observable<ApiResponse<any>> {
    return this.apiService.deleteCommunity(id).pipe(
      map((res) => {
        if (res.success) {
          this.myCommunities.update((communities) =>
            communities.filter((c) => c.id !== id)
          );

          if (id === this.activeCommunity()?.id) {
            this.setCurrentCommunity(null);
          }
        }
        return res;
      })
    );
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

  fetchUsersInCommunityFromApi(id: number) {
    if (!id) return;
    this.apiService
      .getUsersInCommunity(id)
      .pipe(
        map((data) => data.data.map((item) => this.userAdapter.adapt(item)))
      )
      .subscribe((users) => this.usersInActiveCommunity.set(users));
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
    this.authService.activeCommunityId.set(communityId);
  }

  updateCommunityName(
    communityId: number,
    name: string
  ): Observable<ApiResponse<Community>> {
    return this.apiService.updateCommunityName(communityId, name).pipe(
      map((res) => {
        const apiResponse = new ApiResponse<Community>({
          ...res,
          data: res.success ? this.communityAdapter.adapt(res.data) : null,
        });
        if (res.success) {
          this.myCommunities.update((communities) =>
            communities.map((c) =>
              c.id === communityId ? apiResponse.data : c
            )
          );
        }

        return apiResponse;
      })
    );
  }
}
