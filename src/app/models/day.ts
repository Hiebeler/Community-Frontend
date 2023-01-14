import { Task } from './task';

export class Day {

  public name: string;
  public openTasks: Task[];
  public doneTasks: Task[];
  public date: Date;

  constructor(name: string, openTasks: Task[], doneTasks: Task[], date: Date) {
    this.name = name;
    this.openTasks = openTasks;
    this.doneTasks = doneTasks;
    this.date = date;
  }
}
