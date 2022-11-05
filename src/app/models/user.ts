import { SafeResourceUrl } from '@angular/platform-browser';

export class User {

  public id: number;
  public email: string;
  public username: string;
  public firstname: string;
  public lastname: string;
  public profileimage: SafeResourceUrl;
  public creationDate: Date;

  constructor(data?: any) {
    this.id = data?.id;
    this.email = data?.email;
    this.username = data?.username;
    this.firstname = data?.firstname;
    this.lastname = data?.lastname;
    this.profileimage = data?.profileimage;
    this.creationDate = data?.creationdate;
  }
}
