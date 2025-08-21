import { Injectable } from '@angular/core';
import { ApiCalendarEntry, CalendarEntry } from './calendarEntry.model';
import { Adapter } from './adapter';
import { UserAdapter } from './user.adapter';

@Injectable({
  providedIn: 'root',
})
export class CalendarEntryAdapter
  implements Adapter<ApiCalendarEntry, CalendarEntry>
{
  constructor(private userAdapter: UserAdapter) {}

  adapt(item: ApiCalendarEntry): CalendarEntry {
    const date = new Date(item.date);
    const users = [];
    item.assignedUsers?.forEach((element) => {
      users.push(this.userAdapter.adapt(element));
    });

    return new CalendarEntry({
      id: item.id,
      name: item.name,
      notes: item.notes,
      date,
      done: item.done,
      routineId: item.fk_routine_id,
      communityId: item.community_id,
      assignedUsers: users,
    });
  }
}
