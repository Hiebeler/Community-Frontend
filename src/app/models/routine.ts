import { User } from './user';

export class Routine {

  public name: string;
  public notes: string;
  public startDate: Date;
  public communityId: number;
  public assignedUsers: User[];

  constructor(
    name: string,
    notes: string,
    startDate: Date,
    communityId: number,
    assignedUsers: User[]
  ) {
    this.name = name;
    this.notes = notes;
    this.startDate = startDate;
    this.communityId = communityId;
    this.assignedUsers = assignedUsers ?? [];
  }
}
