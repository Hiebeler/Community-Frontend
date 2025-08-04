import { Injectable } from '@angular/core';
import { ApiCommunity, Community } from './community.model';
import { Adapter } from './adapter';
import { UserAdapter } from './user.adapter';

@Injectable({
  providedIn: 'root',
})
export class CommunityAdapter implements Adapter<ApiCommunity, Community> {
  constructor(private userAdapter: UserAdapter) {}

  adapt(item: ApiCommunity): Community | null {
    let admin = undefined;
    if (item.id) {
      if (item.admin) {
        admin = this.userAdapter.adapt(item.admin);
      }

      return new Community({
        id: item.id,
        name: item.name,
        code: item.code,
        adminId: item.fk_admin_id,
        admin,
        memberCount: item.userCount,
      });
    } else {
      return null;
    }
  }
}
