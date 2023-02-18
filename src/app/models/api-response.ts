export class ApiResponse {

  public status: 'Error' | 'OK';
  public error: string;
  public data: any;

  constructor(status: 'Error' | 'OK', error: string, data: any) {
    this.status = status;
    this.error = error;
    this.data = data;
  }
}
