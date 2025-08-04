import { Injectable } from '@angular/core';
import { ApiDay, Day } from './day.model';
import { Adapter } from './adapter';
import { CalendarEntryAdapter } from './calendar-entry.adapter';

@Injectable({
  providedIn: 'root',
})
export class DayAdapter implements Adapter<ApiDay, Day> {
  constructor(private calendarAdapter: CalendarEntryAdapter) {}

  adapt(item: ApiDay): Day {
    const calendarEntries = item.openTasks.map((it) =>
      this.calendarAdapter.adapt(it)
    );

    const date = new Date(item.date)

    return new Day(item.name, calendarEntries, date);
  }
}
