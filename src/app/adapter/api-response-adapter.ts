import { Injectable } from '@angular/core';
import { Adapter } from './adapter';
import { ApiResponse } from '../models/api-response';

@Injectable({
  providedIn: 'root',
})

export class ApiResponseAdapter implements Adapter<ApiResponse> {

  constructor(){}

  adapt(item: any): ApiResponse {

    item.status = item?.status ?? 'Error';
    item.error = item?.error ?? '';
    item.data = item?.data ?? {};

    return new ApiResponse(item.status, item.error, item.data);
  }
}
