import { Injectable } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ApiUser, User } from './user.model';
import { Adapter } from './adapter';

@Injectable({
  providedIn: 'root',
})
export class UserAdapter implements Adapter<ApiUser, User> {
  constructor(private domSanitizer: DomSanitizer) {}

  adapt(item: ApiUser): User {
    const creationDate = new Date(item.creationdate);

    const profileImage: SafeResourceUrl =
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        item.profile_image ?? '/assets/images/defaultavatar.svg'
      );

    return new User({
      id: item.id,
      email: item.email,
      name: item.name,
      profileImage,
      creationDate,
      isAdmin: item.isAdmin ?? false,
      communityId: item.fk_community_id,
      communities: item.communities,
    });
  }
}
