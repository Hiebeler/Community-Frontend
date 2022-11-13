import { Injectable } from '@angular/core';
import { Task } from '../models/task';
import { User } from '../models/user';
import { Adapter } from './adapter';

@Injectable({
  providedIn: 'root',
})

export class TaskAdapter implements Adapter<Task> {

  constructor() { }

  adapt(item: any): Task {
    item.date = new Date(item.date);
    // item.user = new User(item.user);
    return new Task(item);
  }
}
