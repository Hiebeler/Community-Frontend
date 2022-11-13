import { Injectable } from '@angular/core';
import { Day } from '../models/day';
import { Task } from '../models/task';
import { Adapter } from './adapter';

@Injectable({
  providedIn: 'root',
})

export class DayAdapter implements Adapter<Day> {
  adapt(item: any): Day {
    let fief: Task[];
    item.tasks.forEach(task => {
      const tsk = new Task(task.name);
    });

    // item.newtasks Task[];

    return new Day(item);
  }
}
