export class ApiResponse<T> {
  readonly status: 'Error' | 'OK';
  readonly error: string;
  readonly data: T;

  constructor(params: { status: 'Error' | 'OK'; error: string; data: T }) {
    this.status = params.status;
    this.error = params.error;
    this.data = params.data;
  }

  get success(): boolean {
    return this.status === 'OK';
  }
}
