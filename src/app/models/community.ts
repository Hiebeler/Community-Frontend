export class Community {

  public id: number;
  public name: string;
  public code: string;
  public adminId: number;

  constructor(id: number, name: string, code: string, adminId: number) {
    this.id = id;
    this.name = name;
    this.code = code;
    this.adminId = adminId;
  }
}
