import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Routine } from '../models/routine';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor(
    private apiService: ApiService
  ) { }

  getRoutines(): Observable<Routine[]> {
    return this.apiService.getRoutines();
  }

  addRoutine(routine: Routine): Observable<any> {
    const data = {
      id: routine.id,
      name: routine.name,
      startDate: routine.startDate,
      interval: routine.interval
    };
    return this.apiService.modifyRoutine(data);
  }

  updateRoutine(routine: Routine): Observable<any> {
    return null;
  }
}
