export class ApiResponse<T> {
  public status: 'Error' | 'OK';
  public error: string;
  public data: T;

  constructor(status: 'Error' | 'OK', error: string, data: T) {
    this.status = status;
    this.error = error;
    this.data = data;
  }
}
