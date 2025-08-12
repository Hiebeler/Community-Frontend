import { ApiUser, User } from './user.model';

export interface ApiCommunity {
  id: number;
  name: string;
  code: string;
  admin: ApiUser;
  userCount: number;
}

export class Community {
  readonly id: number;
  readonly name: string;
  readonly code: string;
  readonly admin: User;
  readonly memberCount: number;

  constructor(params: {
    id: number;
    name: string;
    code: string;
    admin: User;
    memberCount: number;
  }) {
    this.id = params.id;
    this.name = params.name;
    this.code = params.code;
    this.admin = params.admin;
    this.memberCount = params.memberCount;
  }
}
