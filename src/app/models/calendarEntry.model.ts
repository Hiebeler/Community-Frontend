import { ApiUser, User } from './user.model';

export interface ApiCalendarEntry {
  id: number;
  name: string;
  notes: string;
  date: string;
  done?: boolean;
  fk_routine_id: number;
  community_id: number;
  assigned_users: ApiUser[];
}

export class CalendarEntry {
  public id: number;
  public name: string;
  public notes: string;
  public date: Date;
  public done: boolean;
  public fkRoutineId: number;
  public communityId: number;
  public assignedUsers: User[];

  constructor(params: {
    id: number;
    name: string;
    notes: string;
    date: Date;
    done: boolean;
    routineId: number;
    communityId: number;
    assignedUsers: User[];
  }) {
    this.id = params.id;
    this.name = params.name;
    this.notes = params.notes;
    this.date = params.date;
    this.done = params.done ?? false;
    this.fkRoutineId = params.routineId;
    this.communityId = params.communityId;
    this.assignedUsers = params.assignedUsers ?? [];
  }
}
