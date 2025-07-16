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

  apiGet(url: string, auth?: boolean): Observable<ApiResponse> {
    if (auth) {
      const token = this.getHeader();
      if (token) {
        return this.getWithHeader(url, token);
      }

      this.returnUnauthorizedObservable();
    }

    return this.getWithoutHeader(url);
  }

  apiPost(url: string, body: any, auth?: boolean): Observable<ApiResponse> {
    if (auth) {
      const token = this.getHeader();
      if (token) {
        return this.postWithHeader(url, body, token);
      }

      this.returnUnauthorizedObservable();
    }

    return this.postWithoutHeader(url, body);
  }

  apiPut(url: string, body: any): Observable<ApiResponse> {
    const token = this.getHeader();
    if (token) {
      return this.httpClient.put<any>(environment.api + url, body, { headers: token }).pipe(
        map(data => this.apiResponseAdapter.adapt(data))
      );
    }

    this.returnUnauthorizedObservable();
  }

  apiDelete(url: string): Observable<ApiResponse> {
    const token = this.getHeader();
    if (token) {
      return this.httpClient.delete<any>(environment.api + url, { headers: token }).pipe(
        map(data => this.apiResponseAdapter.adapt(data))
      );
    }

    this.returnUnauthorizedObservable();
  }

  returnUnauthorizedObservable(): Observable<ApiResponse> {
    return new Observable((observer) => {
      observer.next(this.apiResponseAdapter.adapt({ status: 'Error', error: 'Missing JWT' }));
    });
  }

  getWithHeader(url: string, headers: HttpHeaders): Observable<ApiResponse> {
    return this.httpClient.get<any>(environment.api + url, { headers }).pipe(
      map(data => this.apiResponseAdapter.adapt(data))
    );
  }

  getWithoutHeader(url: string): Observable<ApiResponse> {
    return this.httpClient.get<any>(environment.api + url).pipe(
      map(data => this.apiResponseAdapter.adapt(data))
    );
  }

  postWithHeader(url: string, body: any, headers: HttpHeaders): Observable<ApiResponse> {
    return this.httpClient.post<any>(environment.api + url, body, { headers }).pipe(
      map(data => this.apiResponseAdapter.adapt(data))
    );
  }

  postWithoutHeader(url: string, body: any): Observable<ApiResponse> {
    return this.httpClient.post<any>(environment.api + url, body).pipe(
      map(data => this.apiResponseAdapter.adapt(data))
    );
  }


  getUserById(id: number): Observable<ApiResponse> {
    return this.apiGet('user/databyuserid/' + id, true);
  }

  getUsersInCommunity(communityId): Observable<ApiResponse> {
    return this.apiGet('user/getcommunitymembers/' + communityId, true);
  }

  updateUser(data: any): Observable<ApiResponse> {
    return this.apiPut('user/update', data);
  }

  register(data: any): Observable<ApiResponse> {
    return this.apiPost('registration/register', data);
  }

  login(email: string, password: string): Observable<ApiResponse> {
    return this.apiPost('registration/login', { email, password });
  }

  verify(code: string): Observable<ApiResponse> {
      return this.apiGet('registration/verify/' + code);
  }

  getNewJWT(): Observable<ApiResponse> {
    return this.apiGet('registration/getnewtoken', true);
  }

  checkCode(code: string): Observable<ApiResponse> {
    return this.apiGet('registration/checkresetcode/' + code);
  }

  uploadImage(file: File): Observable<any> {
    const dataFile = new FormData();
    dataFile.append('image', file);
    const headers = new HttpHeaders({ authorization: 'Client-ID c0df3b4f744766f' });
    return this.httpClient.post('https://api.imgur.com/3/image/', dataFile, { headers });
  }

  getCommunityByCode(code: string): Observable<ApiResponse> {
    return this.apiGet('community/getbycode/' + code, true);
  }

  getCommunityById(id: number): Observable<ApiResponse> {
    return this.apiGet('community/getbyid/' + id, true);
  }

  joinCommunity(data: any): Observable<ApiResponse> {
    return this.apiPost('user/sendrequest', data, true);
  }

  createCommunity(data: any): Observable<ApiResponse> {
    return this.apiPost('community/create', data, true);
  }

  getRequests(): Observable<ApiResponse> {
    return this.apiGet('community/requests', true);
  }

  acceptRequest(data: any, status: boolean): Observable<ApiResponse> {
    const url: string = status ? 'community/acceptrequest' : 'community/denyrequest';
    return this.apiPost(url, data, true);
  }

  getTasks(data: any): Observable<ApiResponse> {
    return this.apiPost('task/gettasksininterval', data, true);
  }

  updateTask(data: any): Observable<ApiResponse> {
    return this.apiPost('task/create', data, true);
  }

  deleteTask(id: number): Observable<ApiResponse> {
    return this.apiDelete('task/delete/' + id);
  }

  getOpenShoppingItems(): Observable<ApiResponse> {
    return this.apiGet('shoppinglist/items/getopen', true);
  }

  getDoneShoppingItems(): Observable<ApiResponse> {
    return this.apiGet('shoppinglist/items/getdone', true);
  }

  addShoppingItem(itemName: string): Observable<ApiResponse> {
    return this.apiPost('shoppinglist/items/add', { name: itemName }, true);
  }

  updateShoppingItem(data: any): Observable<ApiResponse> {
    return this.apiPut('shoppinglist/items/update', data);
  }

  getDebtBalance(): Observable<ApiResponse> {
    return this.apiGet('debt/balance', true);
  }

  getMyDebts(): Observable<ApiResponse> {
    return this.apiGet('debt/mine', true);
  }

  addDebt(data: any): Observable<ApiResponse> {
    return this.apiPost('debt/create', data, true);
  }

  getRoutines(): Observable<ApiResponse> {
    return this.apiGet('task/routine/all', true);
  }

  modifyRoutine(data: any): Observable<ApiResponse> {
    return this.apiPost('task/routine/modify', data, true);
  }
}
