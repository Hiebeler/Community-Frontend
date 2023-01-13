import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Community } from '../models/community';
import { ApiService } from './api.service';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class CommunityService {

  private community = new BehaviorSubject<Community>(null);

  constructor(
    private apiService: ApiService,
    private userService: UserService
  ) {
    this.userService.getCurrentUser().subscribe(user => {
      if (user?.communityId !== this.community.value?.id) {
        this.fetchCurrentCommunityFromApi(user.communityId);
      }
    });
   }

  getCurrentCommunity(): Observable<Community> {
    return this.community;
  }

  fetchCurrentCommunityFromApi(id?: number): void {
    this.apiService.getCommunityById(id ?? this.community.value.id ?? -1).subscribe(community => {
      this.community.next(community);
    });
  }
}
