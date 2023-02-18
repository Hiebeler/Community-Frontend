import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, concatMap, map, Observable, of, Subscription } from 'rxjs';
import { RoutineAdapter } from '../adapter/routine-adapter';
import { TaskAdapter } from '../adapter/task-adapter';
import { Routine } from '../models/routine';
import { Task } from '../models/task';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class TaskService implements OnDestroy {

  subscriptions: Subscription[] = [];

  private routines = new BehaviorSubject<Routine[]>([]);

  constructor(
    private apiService: ApiService,
    private taskAdapter: TaskAdapter,
    private routineAdapter: RoutineAdapter
  ) { }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  getTasks(startDate: Date, endDate: Date): Observable<Task[]> {
    return this.apiService.getTasks({ startDate, endDate }).pipe(
      concatMap(res => {
        if (res.status !== 'OK') {
          return [];
        } else {
          return of(res);
        }
      }), map((res: any) => res.data.map((item) => this.taskAdapter.adapt(item)))
    );
  }

  updateTask(data: any): Observable<any> {
    return this.apiService.updateTask(data);
  }

  deleteTask(id: number): Observable<any> {
    return this.apiService.deleteTask(id);
  }

  getRoutines(): Observable<Routine[]> {
    return this.routines;
  }

  fetchRoutinesFromApi(): void {
    this.subscriptions.push(this.apiService.getRoutines().pipe(
      map((data: any) => data.data.map((item) => this.routineAdapter.adapt(item)))
    ).subscribe(routines => {
      this.routines.next(routines);
    }));
  }

  modifyRoutine(routine: Routine): Observable<any> {
    const idArray = routine.assignedUsers.map((item) => item.id);

    const data = {
      id: routine.id,
      name: routine.name,
      startDate: routine.startDate,
      interval: routine.interval,
      active: routine.active,
      assignedUser: idArray
    };
    return this.apiService.modifyRoutine(data);
  }
}
