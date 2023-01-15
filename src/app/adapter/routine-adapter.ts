import { Injectable } from '@angular/core';
import { Adapter } from './adapter';
import { UserAdapter } from './user-adapter';
import { Routine } from '../models/routine';

@Injectable({
  providedIn: 'root',
})

export class RoutineAdapter implements Adapter<Routine> {

  constructor(private userAdapter: UserAdapter){}

  adapt(item: any): Routine {
    item.start_date = new Date(item.start_date);
    item.assigned_users = [];
    return new Routine(item.name, item.notes, item.start_date, item.community_id, item.assigned_users);
  }
}
