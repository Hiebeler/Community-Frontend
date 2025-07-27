import { Injectable } from '@angular/core';
import { Adapter } from './adapter';
import { UserAdapter } from './user-adapter';
import { Routine } from '../models/routine';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root',
})

export class RoutineAdapter implements Adapter<Routine> {

  constructor(private userAdapter: UserAdapter) { }

  adapt(item: any): Routine {
    item.startDate = new Date(item.startDate);
    item.routine_user = item.routine_user ?? [];

    const assignedUsers: User[] = item.assignedUsers.map((assigndUser) => this.userAdapter.adapt(assigndUser));

    return new Routine(item.id, item.name, item.notes ?? '', item.startDate, item.interval, item.active, assignedUsers);
  }
}
