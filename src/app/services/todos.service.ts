import { effect, Injectable, signal } from '@angular/core';
import { concatMap, map, Observable, of } from 'rxjs';
import { ApiService } from './api.service';
import { Todo } from '../models/todo.model';
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
      console.log('active community changed');
      if (communityId) {
        this.fetchTodosFromApi();
      } else {
        this.openTodos.set([]);
        this.doneTodos.set([]);
      }
    });

    effect(() => {
      console.log('Open todos changed:', this.openTodos());
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
      map((res) => {
        const apiResponse = new ApiResponse<Todo>({
          ...res,
          data: res.success ? this.todoAdapter.adapt(res.data) : null,
        });

        if (apiResponse.success && apiResponse.data) {
          this.openTodos.update((todos) => [apiResponse.data, ...todos]);
        }

        return apiResponse;
      })
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
      map((res) => {
        const apiResponse = new ApiResponse<Todo>({
          ...res,
          data: res.success ? this.todoAdapter.adapt(res.data) : null,
        });

        if (apiResponse.success && apiResponse.data) {
          const updated = apiResponse.data;

          if (updated.done) {
            // Remove from openTodos if present
            this.openTodos.update((todos) =>
              todos.filter((t) => t.id !== updated.id)
            );
            // Add to doneTodos if not already present
            this.doneTodos.update((todos) => {
              const exists = todos.some((t) => t.id === updated.id);
              return exists
                ? todos.map((t) => (t.id === updated.id ? updated : t))
                : [updated, ...todos];
            });
          } else {
            // Remove from doneTodos if present
            this.doneTodos.update((todos) =>
              todos.filter((t) => t.id !== updated.id)
            );
            // Add to openTodos if not already present
            this.openTodos.update((todos) => {
              const exists = todos.some((t) => t.id === updated.id);
              return exists
                ? todos.map((t) => (t.id === updated.id ? updated : t))
                : [updated, ...todos];
            });
          }
        }

        return apiResponse;
      })
    );
}


  deleteTodo(id: number): Observable<ApiResponse<any>> {
    return this.apiService.deleteTodo(id).pipe(
      map((res) => {
        if (res.success) {
          this.openTodos.update((todos) => todos.filter((t) => t.id !== id));
          this.doneTodos.update((todos) => todos.filter((t) => t.id !== id));
        }

        return res;
      })
    );
  }
}
