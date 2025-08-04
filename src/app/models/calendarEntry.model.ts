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

  constructor(
    id: number,
    name: string,
    notes: string,
    date: Date,
    done: boolean,
    routineId: number,
    communityId: number,
    assignedUsers: User[]
  ) {
    this.id = id;
    this.name = name;
    this.notes = notes;
    this.date = date;
    this.done = done ?? false;
    this.fkRoutineId = routineId;
    this.communityId = communityId;
    this.assignedUsers = assignedUsers ?? [];
  }
}
