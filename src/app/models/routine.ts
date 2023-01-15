import { User } from './user';

export class Routine {

  public id: number;
  public name: string;
  public notes: string;
  public startDate: Date;
  public interval: number;
  public active: boolean;
  public assignedUsers: User[];

  constructor(
    id: number,
    name: string,
    notes: string,
    startDate: Date,
    interval: number,
    active: boolean,
    assignedUsers: User[]
  ) {
    this.id = id;
    this.name = name;
    this.notes = notes;
    this.startDate = startDate;
    this.interval = interval;
    this.active = active;
    this.assignedUsers = assignedUsers ?? [];
  }
}
