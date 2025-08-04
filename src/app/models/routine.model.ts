import { ApiUser, User } from './user.model';

export interface ApiRoutine {
  id: number;
  name: string;
  notes: string;
  startDate: string;
  interval: number;
  active: boolean;
  routine_users: ApiUser[];
}

export class Routine {
  public id: number;
  public name: string;
  public notes: string;
  public startDate: Date;
  public interval: number;
  public active: boolean;
  public assignedUsers: User[];

  constructor(params: {
    id: number;
    name: string;
    notes: string;
    startDate: Date;
    interval: number;
    active: boolean;
    assignedUsers: User[];
  }) {
    this.id = params.id;
    this.name = params.name;
    this.notes = params.notes;
    this.startDate = params.startDate;
    this.interval = params.interval;
    this.active = params.active;
    this.assignedUsers = params.assignedUsers ?? [];
  }
}
