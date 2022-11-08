import { Task } from './task';

export class Day {

  public name: string;
  public tasks: Task[];
  public date: Date;

  constructor(data?: any) {
    this.name = data?.name;
    this.tasks = data?.tasks;
    this.date = data?.date;
  }
}
