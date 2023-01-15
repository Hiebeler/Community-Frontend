import { Injectable } from '@angular/core';
import { Adapter } from './adapter';
import { UserAdapter } from './user-adapter';
import { Routine } from '../models/routine';

@Injectable({
  providedIn: 'root',
})

export class RoutineAdapter implements Adapter<Routine> {

  constructor(private userAdapter: UserAdapter) { }

  adapt(item: any): Routine {
    console.log(item);
    item.startDate = new Date(item.startDate);
    item.routine_user = item.routine_user ?? [];

    const arr = [];

    item.routine_user.map(e => {
      arr.push(this.userAdapter.adapt(e.user));
    });

    return new Routine(item.id, item.name, item.notes ?? '', item.startDate, item.interval, item.community_id, arr);
  }
}
