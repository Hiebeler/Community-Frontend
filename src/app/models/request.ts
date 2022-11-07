import { User } from './user';

export class Request {

    public id: number;
    public date: Date;
    public userId: number;
    public communityId: number;
    public user: User;

    constructor(data?: any) {
      this.id = data?.id;
      this.date = data?.date;
      this.userId = data?.fk_user_id;
      this.communityId = data?.fk_community_id;
      this.user = data?.user;
    }
  }
