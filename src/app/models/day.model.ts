import { ApiCalendarEntry, CalendarEntry } from './calendarEntry.model';

export interface ApiDay {
  name: string;
  openTasks: ApiCalendarEntry[];
  date: string;
}

export class Day {
  readonly name: string;
  readonly calendarEntries: CalendarEntry[];
  readonly date: Date;

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
