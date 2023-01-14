import { User } from './user';

export class Request {

  public id: number;
  public date: Date;
  public userId: number;
  public communityId: number;
  public user: User;

  constructor(id: number, date: Date, userId: number, communityId: number, user: User) {
    this.id = id;
    this.date = date;
    this.userId = userId;
    this.communityId = communityId;
    this.user = user;
  }
}
