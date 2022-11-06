import { SafeResourceUrl } from '@angular/platform-browser';

export class User {

  public id: number;
  public email: string;
  public username: string;
  public firstname: string;
  public lastname: string;
  public profileimage: SafeResourceUrl;
  public creationDate: Date;
  public communityId: number;

  constructor(data?: any) {
    this.id = data?.id;
    this.email = data?.email;
    this.firstname = data?.firstname;
    this.lastname = data?.lastname;
    this.profileimage = data?.profile_image;
    this.creationDate = data?.creationdate;
    this.communityId = data?.fk_community_id;
  }
}
