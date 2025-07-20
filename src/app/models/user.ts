import { SafeResourceUrl } from '@angular/platform-browser';
import { Community } from './community';

export class User {

  public id: number;
  public email: string;
  public username: string;
  public firstname: string;
  public lastname: string;
  public profileimage: SafeResourceUrl;
  public creationDate: Date;
  public communityId: number;
  public color: string;
  public communities: Community[];

  constructor(
    id: number,
    email: string,
    firstname: string,
    lastname: string,
    profileImage: SafeResourceUrl,
    creationDate: Date,
    communityId: number,
    color: string,
    communities: Community[]
  ) {
    this.id = id;
    this.email = email;
    this.firstname = firstname;
    this.lastname = lastname;
    this.profileimage = profileImage;
    this.creationDate = creationDate;
    this.communityId = communityId;
    this.color = color;
    this.communities = communities;
  }
}
