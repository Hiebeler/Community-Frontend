import { User } from './user';

export class Task {

  public id: number;
  public name: string;
  public notes: string;
  public date: Date;
  public fkRoutineId: number;
  public assignedUsers: User[];

  constructor(data?: any) {
    this.id = data?.id;
    this.name = data?.name;
    this.notes = data?.notes;
    this.date = data?.date;
    this.fkRoutineId = data?.fk_routine_id;
    this.assignedUsers = data?.assigned_users ?? [];
  }
}
