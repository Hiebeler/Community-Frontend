import { ApiUser, User } from './user.model';

export interface ApiCommunity {
  id: number;
  name: string;
  code: string;
  fk_admin_id: number;
  admin: ApiUser;
  userCount: number;
}

export class Community {
  public id: number;
  public name: string;
  public code: string;
  public adminId: number;
  public admin: User;
  public memberCount: number;

  constructor(
    id: number,
    name: string,
    code: string,
    adminId: number,
    admin: User,
    memberCount: number
  ) {
    this.id = id;
    this.name = name;
    this.code = code;
    this.adminId = adminId;
    this.admin = admin;
    this.memberCount = memberCount;
  }
}
