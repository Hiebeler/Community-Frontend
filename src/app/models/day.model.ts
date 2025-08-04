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

  constructor(params: {
    name: string;
    calendarEntries: CalendarEntry[];
    date: Date;
  }) {
    this.name = params.name;
    this.calendarEntries = params.calendarEntries;
    this.date = params.date;
  }
}
