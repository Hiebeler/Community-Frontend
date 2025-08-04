import { Injectable } from '@angular/core';
import { Adapter } from './adapter';
import { UserAdapter } from './user.adapter';
import { ApiRoutine, Routine } from './routine.model';

@Injectable({
  providedIn: 'root',
})
export class RoutineAdapter implements Adapter<ApiRoutine, Routine> {
  constructor(private userAdapter: UserAdapter) {}

  adapt(item: ApiRoutine): Routine {
    const startDate = new Date(item.startDate);
    const assignedUsers = (item.routine_users ?? []).map((assigndUser) =>
      this.userAdapter.adapt(assigndUser)
    );

    return new Routine({
      id: item.id,
      name: item.name,
      notes: item.notes ?? '',
      startDate: startDate,
      interval: item.interval,
      active: item.active,
      assignedUsers: assignedUsers,
    });
  }
}
