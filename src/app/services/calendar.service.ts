import { computed, Injectable, OnDestroy, signal } from '@angular/core';
import { concatMap, map, Observable, of, Subscription } from 'rxjs';
import { RoutineAdapter } from '../models/routine.adapter';
import { CalendarEntryAdapter } from '../models/calendar-entry.adapter';
import { ApiRoutine, CreateRoutine, Routine } from '../models/routine.model';
import { ApiService } from './api.service';
import { ApiCalendarEntry, CalendarEntry } from '../models/calendarEntry.model';
import { ApiResponse } from '../models/api-response';

@Injectable({
  providedIn: 'root',
})
export class CalendarService implements OnDestroy {
  subscriptions: Subscription[] = [];

  routines = signal<Routine[]>([]);

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
          console.log(res.data);
          return of(res);
        } else {
          return [];
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
          this.routines.set(routines); // nach active und inactive sortieren
        })
    );
  }

  createRoutine(routine: CreateRoutine): Observable<ApiResponse<Routine>> {
    return this.apiService.createRoutine(routine).pipe(
      map((res) => {
        const apiResponse = new ApiResponse<Routine>({
          ...res,
          data: res.success ? this.routineAdapter.adapt(res.data) : null,
        });

        if (apiResponse.success && apiResponse.data) {
          this.routines.update((routines) => [
            apiResponse.data,
            ...routines,
          ]);
        }

        return apiResponse;
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

  activeRoutines = computed(() => this.routines().filter((r) => r.active));
  inactiveRoutines = computed(() => this.routines().filter((r) => !r.active));
}
