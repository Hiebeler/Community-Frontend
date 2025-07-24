import { CalendarEntry } from './calendarEntry';

export class Day {

  public name: string;
  public openTasks: CalendarEntry[];
  public doneTasks: CalendarEntry[];
  public date: Date;

  constructor(name: string, openTasks: CalendarEntry[], doneTasks: CalendarEntry[], date: Date) {
    this.name = name;
    this.openTasks = openTasks;
    this.doneTasks = doneTasks;
    this.date = date;
  }
}
