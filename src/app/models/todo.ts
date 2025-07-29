import { User } from './user';

export class Todo {
  public id: number;
  public name: string;
  public description: string;
  public done: boolean;
  public doneDate: Date;
  public creator: User;

  constructor(
    id: number,
    name: string,
    description: string,
    done: boolean,
    doneDate: Date,
    creator: User
  ) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.done = done;
    this.doneDate = doneDate;
    this.creator = creator;
  }
}
