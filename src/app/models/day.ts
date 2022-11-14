import { Task } from './task';

export class Day {

  public name: string;
  public openTasks: Task[];
  public doneTasks: Task[];
  public date: Date;

  constructor(data?: any) {
    this.name = data?.name;
    this.openTasks = data?.openTasks;
    this.doneTasks = data?.doneTasks;
    this.date = data?.date;
  }
}
