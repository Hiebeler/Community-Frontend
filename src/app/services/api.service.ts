import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { StorageService } from './storage.service';
import { ApiResponse } from '../models/api-response';
import { ApiUser } from '../models/user.model';
import { ApiResponseAdapter } from '../models/api-response.adapter';
import { ApiCalendarEntry } from '../models/calendarEntry.model';
import { ApiRoutine } from '../models/routine.model';
import { ApiCommunity } from '../models/community.model';
import { ApiRequest } from '../models/request.model';
import { ApiShoppingItem } from '../models/shopping-item.model';
import { ApiTodo } from '../models/todo.model';
import { ApiBalance } from '../models/balance.model';
import { ApiDebt } from '../models/debt.model';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(
    private httpClient: HttpClient,
    private storageService: StorageService,
    private apiResponseAdapter: ApiResponseAdapter
  ) {}

  getHeader(): HttpHeaders {
    const headers: Record<string, string> = {};

    const token = this.storageService.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const communityId = this.storageService.getCurrentCommunity();
    if (communityId != null) {
      headers['communityId'] = String(communityId);
    }

    return new HttpHeaders(headers);
  }

  private handleResponse<T>(obs: Observable<any>): Observable<ApiResponse<T>> {
    return obs.pipe(
      map((data) =>
        this.apiResponseAdapter.adapt<T>({
          status: 'OK',
          data: data.data,
          error: '',
        })
      ),
      catchError((error: HttpErrorResponse) => {
        console.error('API error:', error);

        let normalizedError: string;

        if (error.status === 0) {
          // Network or CORS error
          normalizedError =
            'Backend is not reachable. Please check your connection.';
        } else if (error.error.error) {
          normalizedError = error.error.error;
        } else {
          normalizedError = 'An unknown error occurred.';
        }

        return of(
          this.apiResponseAdapter.adapt<T>({
            status: 'Error',
            error: normalizedError,
            data: error.error?.data || {},
          })
        );
      })
    );
  }

  apiGet<T>(url: string): Observable<ApiResponse<T>> {
    return this.handleResponse<T>(
      this.httpClient.get<any>(environment.api + url, {
        headers: this.getHeader(),
      })
    );
  }

  apiPost<T>(url: string, body: any): Observable<ApiResponse<T>> {
    return this.handleResponse(
      this.httpClient.post<any>(environment.api + url, body, {
        headers: this.getHeader(),
      })
    );
  }

  apiPut<T>(url: string, body: any): Observable<ApiResponse<T>> {
    return this.handleResponse(
      this.httpClient.put<any>(environment.api + url, body, {
        headers: this.getHeader(),
      })
    );
  }

  apiPatch<T>(url: string, body: any): Observable<ApiResponse<T>> {
    return this.handleResponse(
      this.httpClient.patch<any>(environment.api + url, body, {
        headers: this.getHeader(),
      })
    );
  }

  apiDelete<T>(url: string): Observable<ApiResponse<T>> {
    return this.handleResponse(
      this.httpClient.delete<any>(environment.api + url, {
        headers: this.getHeader(),
      })
    );
  }

  getUserById(id: number): Observable<ApiResponse<ApiUser>> {
    return this.apiGet<ApiUser>('user/' + id);
  }

  getUsersInCommunity(communityId): Observable<ApiResponse<ApiUser[]>> {
    return this.apiGet('community/' + communityId + '/members');
  }

  updateUser(data: any): Observable<ApiResponse<ApiUser>> {
    return this.apiPatch('user', data);
  }

  register(data: {
    email: string;
    name: string;
    password: string;
  }): Observable<ApiResponse<any>> {
    return this.apiPost('auth/register', data);
  }

  login(email: string, password: string): Observable<ApiResponse<any>> {
    return this.apiPost('auth/login', { email, password });
  }

  verify(code: string): Observable<ApiResponse<any>> {
    return this.apiPost('auth/verify/' + code, null);
  }

  resendVerificationEmail(email: string): Observable<ApiResponse<any>> {
    return this.apiPost('auth/resendVerificationEmail', { email });
  }

  requestPasswordReset(email: string): Observable<ApiResponse<any>> {
    return this.apiPost('auth/password-reset/request', { email });
  }

  resetPassword(
    newPassword: string,
    code: string
  ): Observable<ApiResponse<any>> {
    return this.apiPost('auth/password-reset', {
      password: newPassword,
      token: code,
    });
  }

  checkCode(code: string): Observable<ApiResponse<any>> {
    return this.apiGet('auth/checkresetcode/' + code);
  }

  changePassword(
    oldPassword: string,
    newPassword: string
  ): Observable<ApiResponse<any>> {
    return this.apiPut('user/password-change', { oldPassword, newPassword });
  }

  uploadImage(file: File): Observable<any> {
    const dataFile = new FormData();
    dataFile.append('file', file);

    const headers = this.getHeader();

    return this.httpClient.put(environment.api + 'user/avatar', dataFile, {
      headers,
    });
  }

  getCommunityByCode(code: string): Observable<ApiResponse<ApiCommunity>> {
    return this.apiGet('community/code/' + code);
  }

  getCommunityById(id: number): Observable<ApiResponse<ApiCommunity>> {
    return this.apiGet('community/' + id);
  }

  getOwnCommunities(): Observable<ApiResponse<ApiCommunity[]>> {
    return this.apiGet('community/mine');
  }

  joinCommunity(data: any): Observable<ApiResponse<any>> {
    return this.apiPost('community/request', data);
  }

  createCommunity(data: any): Observable<ApiResponse<ApiCommunity>> {
    return this.apiPost('community', data);
  }

  updateCommunityName(
    communityId: number,
    name: string
  ): Observable<ApiResponse<ApiCommunity>> {
    return this.apiPatch('community/' + communityId, { name });
  }

  getRequests(): Observable<ApiResponse<ApiRequest[]>> {
    return this.apiGet('community/requests');
  }

  acceptRequest(data: any, status: boolean): Observable<ApiResponse<any>> {
    const url: string = status
      ? 'community/request/accept'
      : 'community/request/decline';
    return this.apiPost(url, data);
  }

  // Calendar

  getCalendarEntries(data: {
    startDate: Date;
    endDate: Date;
  }): Observable<ApiResponse<ApiCalendarEntry>> {
    return this.apiGet(
      'calendar/interval?startDate=' +
        data.startDate.toISOString() +
        '&endDate=' +
        data.endDate.toISOString()
    );
  }

  createCalendarEntry(data: any): Observable<ApiResponse<ApiCalendarEntry>> {
    return this.apiPost('calendar', data);
  }

  updateCalendarEntry(data: any): Observable<ApiResponse<ApiCalendarEntry>> {
    return this.apiPatch('calendar', data);
  }

  deleteCalendarEntry(id: number): Observable<ApiResponse<any>> {
    return this.apiDelete('calendar/' + id);
  }

  getRoutines(): Observable<ApiResponse<ApiRoutine[]>> {
    return this.apiGet('calendar/routine/all');
  }

  modifyRoutine(data: any): Observable<ApiResponse<ApiRoutine>> {
    return this.apiPost('calendar/routine/modify', data);
  }

  // Shopping list

  getOpenShoppingItems(): Observable<ApiResponse<ApiShoppingItem[]>> {
    return this.apiGet('shoppinglist/open');
  }

  getDoneShoppingItems(): Observable<ApiResponse<ApiShoppingItem[]>> {
    return this.apiGet('shoppinglist/done');
  }

  addShoppingItem(itemName: string): Observable<ApiResponse<ApiShoppingItem>> {
    return this.apiPost('shoppinglist', { name: itemName });
  }

  updateShoppingItem(data: any): Observable<ApiResponse<ApiShoppingItem>> {
    return this.apiPatch('shoppinglist', data);
  }

  deleteShoppingItem(id: number): Observable<ApiResponse<any>> {
    return this.apiDelete('shoppinglist/' + id);
  }

  // Todos

  getOpenTodos(): Observable<ApiResponse<ApiTodo[]>> {
    return this.apiGet('todos/open');
  }

  getDoneTodos(): Observable<ApiResponse<ApiTodo[]>> {
    return this.apiGet('todos/done');
  }

  createTodo(data: any): Observable<ApiResponse<ApiTodo>> {
    return this.apiPost('todos/', data);
  }

  updateTodo(data: {
    id: number;
    name?: string;
    description?: string;
    done?: boolean;
  }): Observable<ApiResponse<ApiTodo>> {
    return this.apiPatch('todos/', data);
  }

  deleteTodo(id: number): Observable<ApiResponse<any>> {
    return this.apiDelete('todos/' + id);
  }

  // Debts

  getDebtBalance(): Observable<ApiResponse<ApiBalance[]>> {
    return this.apiGet('debt/balance');
  }

  getMyDebts(): Observable<ApiResponse<ApiDebt[]>> {
    return this.apiGet('debt/mine');
  }

  addDebt(data: any): Observable<ApiResponse<ApiDebt>> {
    return this.apiPost('debt', data);
  }
}
