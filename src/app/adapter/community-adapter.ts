import { Injectable } from '@angular/core';
import { Community } from '../models/community';
import { Adapter } from './adapter';
import { UserAdapter } from './user-adapter';

@Injectable({
  providedIn: 'root',
})

export class CommunityAdapter implements Adapter<Community | null> {

  constructor(private userAdapter: UserAdapter) { }

  adapt(item: any): Community | null {
    if (item.id) {
      if (item.admin) {
        item.admin = this.userAdapter.adapt(item.admin);
      }

      return new Community(item.id, item.name, item.code, item.fk_admin_id, item.admin, item.userCount);
    }
    else {
      return null;
    }
  }
}
