import { ApiCalendarEntry, CalendarEntry } from './calendarEntry.model';

export interface ApiDay {
  name: string;
  openTasks: ApiCalendarEntry[];
  date: string;
}

export class Day {
  public name: string;
  public calendarEntries: CalendarEntry[];
  public date: Date;

  constructor(
    name: string,
    calendarEntries: CalendarEntry[],
    date: Date
  ) {
    this.name = name;
    this.calendarEntries = calendarEntries;
    this.date = date;
  }
}
