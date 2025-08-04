export class ApiResponse<T> {
  public status: 'Error' | 'OK';
  public error: string;
  public data: T;

  constructor(params: { status: 'Error' | 'OK'; error: string; data: T }) {
    this.status = params.status;
    this.error = params.error;
    this.data = params.data;
  }
}
