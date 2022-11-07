export class Task {

  public id: number;
  public name: string;
  public notes: string;

  constructor(data?: any) {
    this.id = data?.id;
    this.name = data?.name;
    this.notes = data?.notes;
  }
}
