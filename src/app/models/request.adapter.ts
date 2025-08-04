import { Injectable } from '@angular/core';
import { ApiRequest, Request } from './request.model';
import { User } from './user.model';
import { Adapter } from './adapter';
import { UserAdapter } from './user.adapter';

@Injectable({
  providedIn: 'root',
})

export class RequestAdapter implements Adapter<ApiRequest, Request> {
  constructor(private userAdapter: UserAdapter) { }
  adapt(item: ApiRequest): Request {
    const date = new Date(item.date);
    const user = this.userAdapter.adapt(item.user);
    return new Request(item.id, date, item.fk_user_id, item.fk_community_id, user);
  }
}
