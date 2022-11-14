import { User } from './user';

export class Task {

  public id: number;
  public name: string;
  public notes: string;
  public date: Date;
  public done: boolean;
  public fkRoutineId: number;
  public communityId: number;
  public assignedUsers: User[];

  constructor(data?: any) {
    this.id = data?.id;
    this.name = data?.name;
    this.notes = data?.notes;
    this.date = data?.date;
    this.done = data?.done ?? false;
    this.fkRoutineId = data?.fk_routine_id;
    this.communityId = data?.fk_community_id;
    this.assignedUsers = data?.assignedUsers ?? [];
  }
}
