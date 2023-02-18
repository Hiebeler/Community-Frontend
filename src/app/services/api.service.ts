import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { StorageService } from './storage.service';
import { ApiResponseAdapter } from '../adapter/api-response-adapter';
import { ApiResponse } from '../models/api-response';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(
    private httpClient: HttpClient,
    private storageService: StorageService,
    private apiResponseAdapter: ApiResponseAdapter,
  ) { }

  getHeader(): HttpHeaders {
    const headers = new HttpHeaders({
      // eslint-disable-next-line @typescript-eslint/naming-convention
      'Content-Type': 'application/json; charset=utf-8',
      // eslint-disable-next-line @typescript-eslint/naming-convention
      Authorization: 'Bearer ' + this.storageService.getToken()
    });
    return headers;
  }

  getUserById(id: number): Observable<ApiResponse> {
    return this.httpClient.get<any>(environment.api + 'user/databyuserid/' + id, { headers: this.getHeader() }).pipe(
      map(res => this.apiResponseAdapter.adapt(res))
    );
  }

  getUsersInCommunity(communityId): Observable<ApiResponse> {
    return this.httpClient.get<any>(environment.api + 'user/getcommunitymembers/' + communityId, { headers: this.getHeader() }).pipe(
      map(res => this.apiResponseAdapter.adapt(res))
    );
  }

  updateUser(data: any): Observable<ApiResponse> {
    return this.httpClient.put<any>(environment.api + 'user/update', data, { headers: this.getHeader() }).pipe(
      map(res => this.apiResponseAdapter.adapt(res))
    );
  }

  register(data: any): Observable<ApiResponse> {
    return this.httpClient.post<any>(environment.api + 'registration/register', data).pipe(
      map(res => this.apiResponseAdapter.adapt(res))
    );
  }

  login(email: string, password: string): Observable<ApiResponse> {
    return this.httpClient.post<any>(environment.api + 'registration/login', { email, password }).pipe(
      map(data => this.apiResponseAdapter.adapt(data))
    );
  }

  getNewJWT(): Observable<ApiResponse> {
    return this.httpClient.get<any>(environment.api + 'registration/getnewtoken', { headers: this.getHeader() }).pipe(
      map(res => this.apiResponseAdapter.adapt(res))
    );
  }

  checkCode(code: string): Observable<ApiResponse> {
    return this.httpClient.get<any>(environment.api + 'registration/checkresetcode/' + code).pipe(
      map(res => this.apiResponseAdapter.adapt(res))
    );
  }

  uploadImage(file: File): Observable<any> {
    const dataFile = new FormData();
    dataFile.append('image', file);
    const headers = new HttpHeaders({ authorization: 'Client-ID c0df3b4f744766f' });
    return this.httpClient.post('https://api.imgur.com/3/image/', dataFile, { headers });
  }

  getCommunityByCode(code: string): Observable<ApiResponse> {
    return this.httpClient.get<any>(environment.api + 'community/getbycode/' + code, { headers: this.getHeader() }).pipe(
      map(res => this.apiResponseAdapter.adapt(res))
    );
  }

  getCommunityById(id: number): Observable<ApiResponse> {
    return this.httpClient.get<any>(environment.api + 'community/getbyid/' + id, { headers: this.getHeader() }).pipe(
      map(res => this.apiResponseAdapter.adapt(res))
    );
  }

  joinCommunity(data: any): Observable<ApiResponse> {
    return this.httpClient.post<any>(environment.api + 'user/sendrequest', data, { headers: this.getHeader() }).pipe(
      map(res => this.apiResponseAdapter.adapt(res))
    );
  }

  createCommunity(data: any): Observable<ApiResponse> {
    return this.httpClient.post<any>(environment.api + 'community/create', data, { headers: this.getHeader() }).pipe(
      map(res => this.apiResponseAdapter.adapt(res))
    );
  }

  getRequests(): Observable<ApiResponse> {
    return this.httpClient.get<any>(environment.api + 'community/requests', { headers: this.getHeader() }).pipe(
      map(res => this.apiResponseAdapter.adapt(res))
    );
  }

  acceptRequest(data: any, status: boolean): Observable<ApiResponse> {
    const url: string = status ? 'community/acceptrequest' : 'community/denyrequest';
    return this.httpClient.post<any>(environment.api + url, data, { headers: this.getHeader() }).pipe(
      map(res => this.apiResponseAdapter.adapt(res))
    );
  }

  getTasks(data: any): Observable<ApiResponse> {
    return this.httpClient.post<any>(environment.api + 'task/gettasksininterval', data, { headers: this.getHeader() }).pipe(
      map(res => this.apiResponseAdapter.adapt(res))
    );
  }

  updateTask(data: any): Observable<ApiResponse> {
    return this.httpClient.post<any>(environment.api + 'task/create', data, { headers: this.getHeader() }).pipe(
      map(res => this.apiResponseAdapter.adapt(res))
    );
  }

  deleteTask(id: number): Observable<ApiResponse> {
    return this.httpClient.delete<any>(environment.api + 'task/delete/' + id, { headers: this.getHeader() }).pipe(
      map(res => this.apiResponseAdapter.adapt(res))
    );
  }

  getOpenShoppingItems(): Observable<ApiResponse> {
    return this.httpClient.get<any>(environment.api + 'shoppinglist/items/getopen', { headers: this.getHeader() }).pipe(
      map(res => this.apiResponseAdapter.adapt(res))
    );
  }

  getDoneShoppingItems(): Observable<ApiResponse> {
    return this.httpClient.get<any>(environment.api + 'shoppinglist/items/getdone', { headers: this.getHeader() }).pipe(
      map(res => this.apiResponseAdapter.adapt(res))
    );
  }

  addShoppingItem(itemName: string): Observable<ApiResponse> {
    return this.httpClient.post<any>(environment.api + 'shoppinglist/items/add', { name: itemName }, { headers: this.getHeader() }).pipe(
      map(res => this.apiResponseAdapter.adapt(res))
    );
  }

  updateShoppingItem(data: any): Observable<ApiResponse> {
    return this.httpClient.put<any>(environment.api + 'shoppinglist/items/update', data, { headers: this.getHeader() }).pipe(
      map(res => this.apiResponseAdapter.adapt(res))
    );
  }

  getDebtBalance(): Observable<ApiResponse> {
    return this.httpClient.get<any>(environment.api + 'debt/balance', { headers: this.getHeader() }).pipe(
      map(res => this.apiResponseAdapter.adapt(res))
    );
  }

  getMyDebts(): Observable<ApiResponse> {
    return this.httpClient.get<any>(environment.api + 'debt/mine', { headers: this.getHeader() }).pipe(
      map(res => this.apiResponseAdapter.adapt(res))
    );
  }

  addDebt(data: any): Observable<ApiResponse> {
    return this.httpClient.post<any>(environment.api + 'debt/create', data, { headers: this.getHeader() }).pipe(
      map(res => this.apiResponseAdapter.adapt(res))
    );
  }

  getRoutines(): Observable<ApiResponse> {
    return this.httpClient.get<any>(environment.api + 'task/routine/all', { headers: this.getHeader() }).pipe(
      map(res => this.apiResponseAdapter.adapt(res))
    );
  }

  modifyRoutine(data: any): Observable<ApiResponse> {
    return this.httpClient.post<any>(environment.api + 'task/routine/modify', data, { headers: this.getHeader() }).pipe(
      map(res => this.apiResponseAdapter.adapt(res))
    );
  }
}
