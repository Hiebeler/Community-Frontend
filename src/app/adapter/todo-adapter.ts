import { Injectable } from '@angular/core';
import { Adapter } from './adapter';
import { Todo } from '../models/todo';
import { UserAdapter } from './user-adapter';

@Injectable({
  providedIn: 'root',
})
export class TodoAdapter implements Adapter<Todo> {
  constructor(private userAdapter: UserAdapter) {}

  adapt(item: any): Todo {
    return new Todo(
      item.id,
      item.name,
      item.description,
      item.done,
      this.userAdapter.adapt(item.creator)
    );
  }
}
