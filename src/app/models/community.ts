export class Community {

  public id: number;
  public name: string;
  public code: string;
  public adminId: number;

  constructor(data?: any) {
    this.id = data?.id;
    this.name = data?.name;
    this.code = data?.code;
    this.adminId = data?.fk_admin_id;
  }
}
