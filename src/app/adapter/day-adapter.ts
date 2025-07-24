import { Injectable } from '@angular/core';
import { Day } from '../models/day';
import { Adapter } from './adapter';

@Injectable({
  providedIn: 'root',
})

export class DayAdapter implements Adapter<Day> {
  adapt(item: any): Day {
    return new Day(item.name, item.openTasks, item.doneTasks, item.date);
  }
}
