import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, map, Observable, Subscription } from 'rxjs';
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

  getCommunity(code: string): Observable<Community> {
    return this.apiService.getCommunityByCode(code);
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
}
