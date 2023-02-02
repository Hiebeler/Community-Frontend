import { Injectable } from '@angular/core';
import { Community } from '../models/community';
import { Adapter } from './adapter';

@Injectable({
  providedIn: 'root',
})

export class CommunityAdapter implements Adapter<Community | null> {
  adapt(item: any): Community | null {
    if (item.id) {
      return new Community(item.id, item.name, item.code, item.fk_admin_id);
    }
    else {
      return null;
    }
  }
}
