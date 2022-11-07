import { Task } from './task';

export class Day {

  public name: string;
  public tasks: Task[];

  constructor(data?: any) {
    this.name = data?.name;
    this.tasks = data?.tasks;
  }
}
