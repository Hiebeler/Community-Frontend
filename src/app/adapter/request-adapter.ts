import { Injectable } from '@angular/core';
import { Request } from '../models/request';
import { User } from '../models/user';
import { Adapter } from './adapter';
import { UserAdapter } from './user-adapter';

@Injectable({
  providedIn: 'root',
})

export class RequestAdapter implements Adapter<Request> {
  constructor(private userAdapter: UserAdapter) { }
  adapt(item: any): Request {
    item.date = new Date(item.date);
    item.user = this.userAdapter.adapt(item.user);
    return new Request(item.id, item.date, item.fk_user_id, item.fk_community_id, item.user);
  }
}
