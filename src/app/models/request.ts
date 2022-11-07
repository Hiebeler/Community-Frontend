export class Request {

    public id: number;
    public date: Date;
    public userId: number;
    public communityId: number;

    constructor(data?: any) {
      this.id = data?.id;
      this.date = data?.date;
      this.userId = data?.fk_user_id;
      this.communityId = data?.fk_community_id;
    }
  }
