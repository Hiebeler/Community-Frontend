import { Injectable } from '@angular/core';
import { Adapter } from './adapter';
import { ApiTodo, Todo } from './todo.model';
import { UserAdapter } from './user.adapter';

@Injectable({
  providedIn: 'root',
})
export class TodoAdapter implements Adapter<ApiTodo, Todo> {
  constructor(private userAdapter: UserAdapter) {}

  adapt(item: ApiTodo): Todo {
    return new Todo(
      item.id,
      item.name,
      item.description,
      item.done,
      item.doneDate ? new Date(item.doneDate) : undefined,
      this.userAdapter.adapt(item.creator)
    );
  }
}
