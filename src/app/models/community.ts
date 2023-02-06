import { User } from './user';

export class Community {

  public id: number;
  public name: string;
  public code: string;
  public adminId: number;
  public admin: User;

  constructor(id: number, name: string, code: string, adminId: number, admin: User) {
    this.id = id;
    this.name = name;
    this.code = code;
    this.adminId = adminId;
    this.admin = admin;
  }
}
