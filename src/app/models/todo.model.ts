import { ApiUser, User } from './user.model';

export interface ApiTodo {
  id: number;
  name: string;
  description: string;
  done: boolean;
  doneDate?: string | null;
  creator: ApiUser;
}

export class Todo {
  readonly id: number;
  readonly name: string;
  readonly description: string;
  readonly done: boolean;
  readonly doneDate: Date;
  readonly creator: User;

  constructor(params: {
    id: number;
    name: string;
    description: string;
    done: boolean;
    doneDate: Date;
    creator: User;
  }) {
    this.id = params.id;
    this.name = params.name;
    this.description = params.description;
    this.done = params.done;
    this.doneDate = params.doneDate;
    this.creator = params.creator;
  }
}
