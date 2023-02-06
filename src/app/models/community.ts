import { User } from './user';

export class Community {

  public id: number;
  public name: string;
  public code: string;
  public adminId: number;
  public admin: User;
  public memberCount: number;

  constructor(id: number, name: string, code: string, adminId: number, admin: User, memberCount: number) {
    this.id = id;
    this.name = name;
    this.code = code;
    this.adminId = adminId;
    this.admin = admin;
    this.memberCount = memberCount;
  }
}
