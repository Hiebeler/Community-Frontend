import { SafeResourceUrl } from '@angular/platform-browser';
import { Community } from './community';

export class User {

  public id: number;
  public email: string;
  public name: string;
  public profileimage: SafeResourceUrl;
  public creationDate: Date;
  public communityId: number;
  public color: string;
  public communities: Community[];

  constructor(
    id: number,
    email: string,
    name: string,
    profileImage: SafeResourceUrl,
    creationDate: Date,
    communityId: number,
    color: string,
    communities: Community[]
  ) {
    this.id = id;
    this.email = email;
    this.name = name;
    this.profileimage = profileImage;
    this.creationDate = creationDate;
    this.communityId = communityId;
    this.color = color;
    this.communities = communities;
  }
}
