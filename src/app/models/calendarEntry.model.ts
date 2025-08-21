import { ApiUser, User } from './user.model';

export interface ApiCalendarEntry {
  id: number;
  name: string;
  notes: string;
  date: string;
  done?: boolean;
  fk_routine_id: number;
  community_id: number;
  assignedUsers: ApiUser[];
}

export class CalendarEntry {
  readonly id: number;
  readonly name: string;
  readonly notes: string;
  readonly date: Date;
  readonly done: boolean;
  readonly fkRoutineId: number;
  readonly communityId: number;
  readonly assignedUsers: User[];

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
