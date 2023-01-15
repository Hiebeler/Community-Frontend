import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Routine } from '../models/routine';
import { Task } from '../models/task';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor(
    private apiService: ApiService
  ) { }

  getTasks(startDate: Date, endDate: Date): Observable<Task[]> {
    return this.apiService.getTasks({ startDate, endDate });
  }

  getRoutines(): Observable<Routine[]> {
    return this.apiService.getRoutines();
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
