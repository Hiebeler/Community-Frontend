import { Injectable } from '@angular/core';
import { Task } from '../models/task';
import { User } from '../models/user';
import { Adapter } from './adapter';
import { UserAdapter } from './user-adapter';

@Injectable({
  providedIn: 'root',
})

export class TaskAdapter implements Adapter<Task> {

  constructor(private userAdapter: UserAdapter) { }

  adapt(item: any): Task {
    item.date = new Date(item.date);
    const users = [];
    item.task_user?.forEach(element => {
      users.push(this.userAdapter.adapt(element.user));
    });

    item.assignedUsers = users;
    return new Task(item.id, item.name, item.notes, item.date,
      item.done, item.fk_routine_id, item.fk_community_id, item.assignedUsers);
  }
}
