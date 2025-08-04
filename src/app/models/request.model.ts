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

  constructor(params: {
    id: number;
    date: Date;
    userId: number;
    communityId: number;
    user: User;
  }) {
    this.id = params.id;
    this.date = params.date;
    this.userId = params.userId;
    this.communityId = params.communityId;
    this.user = params.user;
  }
}
