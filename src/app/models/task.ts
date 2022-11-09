export class Task {

  public id: number;
  public name: string;
  public notes: string;
  public date: Date;

  constructor(data?: any) {
    this.id = data?.id;
    this.name = data?.name;
    this.notes = data?.notes;
    this.date = data?.date;
  }
}
