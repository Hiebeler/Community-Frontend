import { Injectable } from '@angular/core';
import { CalendarEntry } from '../models/calendarEntry';
import { Adapter } from './adapter';
import { UserAdapter } from './user-adapter';

@Injectable({
  providedIn: 'root',
})

export class CalendarEntryAdapter implements Adapter<CalendarEntry> {

  constructor(private userAdapter: UserAdapter) { }

  adapt(item: any): CalendarEntry {
    item.date = new Date(item.date);
    const users = [];
    item.assignedUsers?.forEach(element => {
      users.push(this.userAdapter.adapt(element));
    });

    item.assignedUsers = users;
    return new CalendarEntry(item.id, item.name, item.notes, item.date,
      item.done, item.fk_routine_id, item.fk_community_id, item.assignedUsers);
  }
}
