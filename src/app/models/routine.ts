import { User } from './user';

export class Routine {

  public id: number;
  public name: string;
  public notes: string;
  public startDate: Date;
  public interval: number;
  public communityId: number;
  public assignedUsers: User[];

  constructor(
    id: number,
    name: string,
    notes: string,
    startDate: Date,
    interval: number,
    communityId: number,
    assignedUsers: User[]
  ) {
    this.id = id;
    this.name = name;
    this.notes = notes;
    this.startDate = startDate;
    this.interval = interval;
    this.communityId = communityId;
    this.assignedUsers = assignedUsers ?? [];
  }
}
