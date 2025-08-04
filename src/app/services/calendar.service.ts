import { Injectable, OnDestroy } from '@angular/core';
import {
  BehaviorSubject,
  concatMap,
  map,
  Observable,
  of,
  Subscription,
} from 'rxjs';
import { RoutineAdapter } from '../models/routine.adapter';
import { CalendarEntryAdapter } from '../models/calendar-entry.adapter';
import { ApiRoutine, Routine } from '../models/routine.model';
import { ApiService } from './api.service';
import { ApiCalendarEntry, CalendarEntry } from '../models/calendarEntry.model';
import { ApiResponse } from '../models/api-response';

@Injectable({
  providedIn: 'root',
})
export class CalendarService implements OnDestroy {
  subscriptions: Subscription[] = [];

  private routines = new BehaviorSubject<Routine[]>([]);

  constructor(
    private apiService: ApiService,
    private calendarEntryAdapter: CalendarEntryAdapter,
    private routineAdapter: RoutineAdapter
  ) {}

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  getCalendarEntries(
    startDate: Date,
    endDate: Date
  ): Observable<CalendarEntry[]> {
    return this.apiService.getCalendarEntries({ startDate, endDate }).pipe(
      concatMap((res) => {
        if (res.success) {
          return of(res);
        } else {
          return []
        }
      }),
      map((res: any) =>
        res.data.map((item) => this.calendarEntryAdapter.adapt(item))
      )
    );
  }

  createCalendarEntry(data: any): Observable<ApiResponse<ApiCalendarEntry>> {
    return this.apiService.createCalendarEntry(data);
  }

  updateCalendarEntry(data: any): Observable<ApiResponse<ApiCalendarEntry>> {
    return this.apiService.updateCalendarEntry(data);
  }

  deleteCalendarEntry(id: number): Observable<ApiResponse<ApiCalendarEntry>> {
    return this.apiService.deleteCalendarEntry(id);
  }

  getRoutines(): Observable<Routine[]> {
    return this.routines;
  }

  fetchRoutinesFromApi(): void {
    this.subscriptions.push(
      this.apiService
        .getRoutines()
        .pipe(
          map((data: ApiResponse<ApiRoutine[]>) =>
            data.data.map((item: ApiRoutine) => this.routineAdapter.adapt(item))
          )
        )
        .subscribe((routines) => {
          this.routines.next(routines);
        })
    );
  }

  modifyRoutine(routine: Routine): Observable<any> {
    const idArray = routine.assignedUsers.map((item) => item.id);

    const data = {
      id: routine.id,
      name: routine.name,
      startDate: routine.startDate,
      interval: routine.interval,
      active: routine.active,
      assignedUser: idArray,
    };
    return this.apiService.modifyRoutine(data);
  }
}
