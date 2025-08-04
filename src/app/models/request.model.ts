import { ApiUser, User } from './user.model';

export interface ApiRequest {
  id: number;
  date: string;
  fk_user_id: number;
  fk_community_id: number;
  user: ApiUser;
}

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
