import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
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
    private apiService: ApiService
  ) { }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  getTasks(startDate: Date, endDate: Date): Observable<Task[]> {
    return this.apiService.getTasks({ startDate, endDate });
  }

  getRoutines(): Observable<Routine[]> {
    return this.routines;
  }

  fetchRoutinesFromApi(): void {
    this.subscriptions.push(this.apiService.getRoutines().subscribe(routines => {
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
