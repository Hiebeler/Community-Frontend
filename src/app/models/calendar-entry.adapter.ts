import { Injectable } from '@angular/core';
import { ApiCalendarEntry, CalendarEntry } from './calendarEntry.model';
import { Adapter } from './adapter';
import { UserAdapter } from './user.adapter';

@Injectable({
  providedIn: 'root',
})

export class CalendarEntryAdapter implements Adapter<ApiCalendarEntry, CalendarEntry> {

  constructor(private userAdapter: UserAdapter) { }

  adapt(item: ApiCalendarEntry): CalendarEntry {
    const date = new Date(item.date);
    const users = [];
    item.assigned_users?.forEach(element => {
      users.push(this.userAdapter.adapt(element));
    });

    return new CalendarEntry(item.id, item.name, item.notes, date,
      item.done, item.fk_routine_id, item.community_id, users);
  }
}
