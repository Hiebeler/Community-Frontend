import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, concatMap, map, Observable, of, Subscription } from 'rxjs';
import { RoutineAdapter } from '../adapter/routine-adapter';
import { CalendarEntryAdapter } from '../adapter/calendar-entry-adapter';
import { Routine } from '../models/routine';
import { ApiService } from './api.service';
import { CalendarEntry } from '../models/calendarEntry';

@Injectable({
  providedIn: 'root'
})
export class TaskService implements OnDestroy {

  subscriptions: Subscription[] = [];

  private routines = new BehaviorSubject<Routine[]>([]);

  constructor(
    private apiService: ApiService,
    private calendarEntryAdapter: CalendarEntryAdapter,
    private routineAdapter: RoutineAdapter
  ) { }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  getTasks(startDate: Date, endDate: Date): Observable<CalendarEntry[]> {
    return this.apiService.getTasks({ startDate, endDate }).pipe(
      concatMap(res => {
        if (res.status !== 'OK') {
          return [];
        } else {
          return of(res);
        }
      }), map((res: any) => res.data.map((item) => this.calendarEntryAdapter.adapt(item)))
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
