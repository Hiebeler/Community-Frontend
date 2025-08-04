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

  constructor(params: {
    id: number;
    name: string;
    code: string;
    adminId: number;
    admin: User;
    memberCount: number;
  }) {
    this.id = params.id;
    this.name = params.name;
    this.code = params.code;
    this.adminId = params.adminId;
    this.admin = params.admin;
    this.memberCount = params.memberCount;
  }
}
