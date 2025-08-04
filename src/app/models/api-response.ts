export class ApiResponse<T> {
  public readonly status: 'Error' | 'OK';
  public readonly error: string;
  public readonly data: T;

  constructor(params: { status: 'Error' | 'OK'; error: string; data: T }) {
    this.status = params.status;
    this.error = params.error;
    this.data = params.data;
  }

  get success(): boolean {
    return this.status === 'OK';
  }
}
