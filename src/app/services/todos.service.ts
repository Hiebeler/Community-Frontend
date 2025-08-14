import { effect, Injectable, OnDestroy, signal } from '@angular/core';
import {
  BehaviorSubject,
  concatMap,
  map,
  Observable,
  of,
  Subscription,
} from 'rxjs';
import { ApiService } from './api.service';
import { ApiTodo, Todo } from '../models/todo.model';
import { TodoAdapter } from '../models/todo.adapter';
import { AuthService } from './auth.service';
import { ApiResponse } from '../models/api-response';

@Injectable({
  providedIn: 'root',
})
export class TodosService {
  openTodos = signal<Todo[]>([]);
  doneTodos = signal<Todo[]>([]);

  constructor(
    private apiService: ApiService,
    private authService: AuthService,
    private todoAdapter: TodoAdapter
  ) {
    effect(() => {
      const communityId = this.authService.activeCommunityId();
      if (communityId) {
        this.fetchTodosFromApi();
      } else {
        this.openTodos.set([]);
        this.doneTodos.set([]);
      }
    });
  }

  private fetchTodosFromApi() {
    // Open todos
    this.apiService
      .getOpenTodos()
      .pipe(
        concatMap((res) => (res.status === 'OK' ? of(res) : of({ data: [] }))),
        map((res: any) => res.data.map((item) => this.todoAdapter.adapt(item)))
      )
      .subscribe((todos) => this.openTodos.set(todos));

    // Done todos
    this.apiService
      .getDoneTodos()
      .pipe(
        concatMap((res) => (res.status === 'OK' ? of(res) : of({ data: [] }))),
        map((res: any) => res.data.map((item) => this.todoAdapter.adapt(item)))
      )
      .subscribe((todos) => this.doneTodos.set(todos));
  }

  createTodo(name: string, description: string): Observable<ApiResponse<Todo>> {
    return this.apiService.createTodo({ name, description }).pipe(
      map(
        (res) =>
          new ApiResponse<Todo>({
            ...res,
            data: res.success ? this.todoAdapter.adapt(res.data) : null,
          })
      )
    );
  }

  updateTodo(todo: Todo): Observable<ApiResponse<Todo>> {
    return this.apiService
      .updateTodo({
        id: todo.id,
        name: todo.name,
        description: todo.description,
        done: todo.done,
      })
      .pipe(
        map(
          (res) =>
            new ApiResponse<Todo>({
              ...res,
              data: res.success ? this.todoAdapter.adapt(res.data) : null,
            })
        )
      );
  }

  deleteTodo(id: number): Observable<ApiResponse<any>> {
    return this.apiService.deleteTodo(id);
  }
}
