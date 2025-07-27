import { Injectable, OnDestroy } from '@angular/core';
import {
  BehaviorSubject,
  concatMap,
  map,
  Observable,
  of,
  Subscription,
} from 'rxjs';
import { ApiService } from './api.service';
import { Todo } from '../models/todo';
import { TodoAdapter } from '../adapter/todo-adapter';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class TodosService implements OnDestroy {
  subscriptions: Subscription[] = [];

  private openTodos = new BehaviorSubject<Todo[]>([]);
  private doneTodos = new BehaviorSubject<Todo[]>([]);

  constructor(
    private apiService: ApiService,
    private authService: AuthService,
    private todoAdapter: TodoAdapter
  ) {
    this.subscriptions.push(
      this.authService.activeCommunityId.subscribe(() => {
        this.fetchTodosFromApi();
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  getOpenTodos(): Observable<Todo[]> {
    return this.openTodos;
  }

  getDoneTodos(): Observable<Todo[]> {
    return this.doneTodos;
  }

  fetchTodosFromApi(): void {
    this.subscriptions.push(
      this.apiService
        .getOpenTodos()
        .pipe(
          concatMap((res) => {
            if (res.status !== 'OK') {
              return [];
            } else {
              return of(res);
            }
          }),
          map((res: any) =>
            res.data.map((item) => this.todoAdapter.adapt(item))
          )
        )
        .subscribe((openTodos) => {
          this.openTodos.next(openTodos);
        })
    );

    this.subscriptions.push(
      this.apiService
        .getDoneTodos()
        .pipe(
          concatMap((res) => {
            if (res.status !== 'OK') {
              return [];
            } else {
              return of(res);
            }
          }),
          map((res: any) =>
            res.data.map((item) => this.todoAdapter.adapt(item))
          )
        )
        .subscribe((doneTodos) => {
          this.doneTodos.next(doneTodos);
        })
    );
  }

  createTodo(name: string, description: string): Observable<any> {
    return this.apiService.createTodo({ name, description });
  }

  updateTodo(todo: Todo): Observable<any> {
    return this.apiService.updateTodo({
      id: todo.id,
      name: todo.name,
      description: todo.description,
      done: todo.done
    });
  }

  deleteTodo(id: number): Observable<any> {
    return this.apiService.deleteTodo(id);
  }
}
