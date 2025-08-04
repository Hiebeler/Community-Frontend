import { Injectable } from '@angular/core';
import { ApiResponse } from './api-response';
import { Adapter } from './adapter';

@Injectable({
  providedIn: 'root',
})
export class ApiResponseAdapter implements Adapter<any, ApiResponse<any>> {
  adapt<T>(item: {status: "OK" | "Error", error: string, data: T}): ApiResponse<T> {
    const status = item.status ?? 'Error';
    const error = item.error ?? '';
    const data = item.data ?? ({} as T);
    return new ApiResponse<T>({ status, error, data });
  }
}
