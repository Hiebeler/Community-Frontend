import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { concatMap, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { CommunityAdapter } from '../adapter/community-adapter';
import { RequestAdapter } from '../adapter/request-adapter';
import { TaskAdapter } from '../adapter/task-adapter';
import { UserAdapter } from '../adapter/user-adapter';
import { Community } from '../models/community';
import { ShoppingItem } from '../models/shopping-item';
import { Task } from '../models/task';
import { User } from '../models/user';
import { StorageService } from './storage.service';
import { Balance } from '../models/balance';
import { BalanceAdapter } from '../adapter/balance-adapter';
import { ShoppingItemAdapter } from '../adapter/shopping-item-adapter';
import { Routine } from '../models/routine';
import { RoutineAdapter } from '../adapter/routine-adapter';
import { Debt } from '../models/debt';
import { DebtAdapter } from '../adapter/debt-adapter';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(
    private httpClient: HttpClient,
    private storageService: StorageService,
    private userAdapter: UserAdapter,
    private communityAdapter: CommunityAdapter,
    private taskAdapter: TaskAdapter,
    private balanceAdapter: BalanceAdapter,
    private shoppingItemAdapter: ShoppingItemAdapter,
    private routineAdapter: RoutineAdapter,
    private debtAdapter: DebtAdapter,
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

  getUser(username: string): Observable<User> {
    return this.httpClient.get<any>(environment.api + 'user/databyusername/' + username).pipe(
      map(data => this.userAdapter.adapt(data))
    );
  }

  getUserById(id: number): Observable<User> {
    return this.httpClient.get<any>(environment.api + 'user/databyuserid/' + id, { headers: this.getHeader() }).pipe(
      map(data => this.userAdapter.adapt(data.data))
    );
  }

  getUsers(): Observable<User[]> {
    return this.httpClient.get<any>(environment.api + 'user/users/').pipe(
      map((data: any[]) => data.map((item) => this.userAdapter.adapt(item)))
    );
  }

  getUsersInCommunity(communityId): Observable<User[]> {
    return this.httpClient.get<any>(environment.api + 'user/getcommunitymembers/' + communityId, { headers: this.getHeader() }).pipe(
      map((data: any) => data.data.map((item) => this.userAdapter.adapt(item)))
    );
  }

  updateUser(data: any): Observable<any> {
    return this.httpClient.put<any>(environment.api + 'user/update', data, { headers: this.getHeader() });
  }

  register(data: any): Observable<any> {
    return this.httpClient.post<any>(environment.api + 'registration/register', data);
  }

  login(email: string, password: string): Observable<any> {
    return this.httpClient.post<any>(environment.api + 'registration/login', { email, password });
  }

  verify(code: string): Observable<boolean> {
    return this.httpClient.get<any>(environment.api + 'registration/verify/' + code).pipe(
      map(data => data.verified)
    );
  }

  sendVerificationMailAgain(email: string): Observable<any> {
    return this.httpClient.post<any>(environment.api + 'registration/sendverificationmailagain', { email });
  }

  changePassword(data: any): Observable<any> {
    return this.httpClient.post<any>(environment.api + 'user/changepw', data, { headers: this.getHeader() });
  }

  resetPassword(email): Observable<any> {
    return this.httpClient.post<any>(environment.api + 'registration/resetpassword/', { email });
  }

  setPassword(data: any): Observable<any> {
    return this.httpClient.post<any>(environment.api + 'registration/setpassword', data);
  }

  checkCode(code: string): Observable<any> {
    return this.httpClient.get<any>(environment.api + 'registration/checkresetcode/' + code);
  }

  uploadImage(file: File): Observable<any> {
    const dataFile = new FormData();
    dataFile.append('image', file);
    const headers = new HttpHeaders({ authorization: 'Client-ID c0df3b4f744766f' });
    return this.httpClient.post('https://api.imgur.com/3/image/', dataFile, { headers });
  }

  getCommunityByCode(code: string): Observable<Community> {
    return this.httpClient.get<any>(environment.api + 'community/getbycode/' + code, { headers: this.getHeader() }).pipe(
      map(res => this.communityAdapter.adapt(res.data))
    );
  }

  getCommunityById(id: number): Observable<Community> {
    return this.httpClient.get<any>(environment.api + 'community/getbyid/' + id, { headers: this.getHeader() }).pipe(
      map(res => this.communityAdapter.adapt(res.data))
    );
  }

  joinCommunity(data: any): Observable<any> {
    return this.httpClient.post<any>(environment.api + 'user/sendrequest', data, { headers: this.getHeader() });
  }

  createCommunity(data: any): Observable<any> {
    return this.httpClient.post<any>(environment.api + 'community/create', data, { headers: this.getHeader() });
  }

  getRequests(): Observable<any> {
    return this.httpClient.get<any>(environment.api + 'community/requests', { headers: this.getHeader() });
  }

  acceptRequest(data: any): Observable<any> {
    return this.httpClient.post<any>(environment.api + 'community/acceptrequest', data, { headers: this.getHeader() });
  }

  getTasks(data: any): Observable<Task[]> {
    return this.httpClient.post<any>(environment.api + 'task/gettasksininterval', data, { headers: this.getHeader() }).pipe(
      concatMap(res => {
        if (res.status !== 'OK') {
          return [];
        } else {
          return of(res);
        }
      }), map((res: any) => res.data.map((item) => this.taskAdapter.adapt(item)))
    );
  }

  updateTask(data: any): Observable<any> {
    return this.httpClient.post<any>(environment.api + 'task/create', data, { headers: this.getHeader() });
  }

  deleteTask(id: number): Observable<any> {
    return this.httpClient.delete<any>(environment.api + 'task/delete/' + id, { headers: this.getHeader() });
  }

  getOpenShoppingItems(): Observable<ShoppingItem[]> {
    return this.httpClient.get<any>(environment.api + 'shoppinglist/items/getopen', { headers: this.getHeader() }).pipe(
      concatMap(res => {
        if (res.status !== 'OK') {
          return [];
        } else {
          return of(res);
        }
      }), map((res: any) => res.data.map((item) => this.shoppingItemAdapter.adapt(item)))
    );
  }

  getDoneShoppingItems(): Observable<ShoppingItem[]> {
    return this.httpClient.get<any>(environment.api + 'shoppinglist/items/getdone', { headers: this.getHeader() }).pipe(
      concatMap(res => {
        if (res.status !== 'OK') {
          return [];
        } else {
          return of(res);
        }
      }), map((res: any) => res.data.map((item) => this.shoppingItemAdapter.adapt(item)))
    );
  }

  addShoppingItem(itemName: string): Observable<any> {
    return this.httpClient.post<any>(environment.api + 'shoppinglist/items/add', { name: itemName }, { headers: this.getHeader() });
  }

  updateShoppingItem(data: any): Observable<any> {
    return this.httpClient.put<any>(environment.api + 'shoppinglist/items/update', data, { headers: this.getHeader() });
  }

  getDebtBalance(): Observable<Balance[]> {
    return this.httpClient.get<any>(environment.api + 'debt/balance', { headers: this.getHeader() }).pipe(
      map((data: any) => data.data.map((item) => this.balanceAdapter.adapt(item)))
    );
  }

  getMyDebts(): Observable<Debt[]> {
    return this.httpClient.get<any>(environment.api + 'debt/mine', { headers: this.getHeader() }).pipe(
      map((data: any) => data.data.map((item) => this.debtAdapter.adapt(item)))
    );
  }

  addDebt(data: any): Observable<any> {
    console.log('create debt');
    return this.httpClient.post<any>(environment.api + 'debt/create', data, { headers: this.getHeader() });
  }

  getRoutines(): Observable<Routine[]> {
    return this.httpClient.get<any>(environment.api + 'task/routine/all', { headers: this.getHeader() }).pipe(
      map((data: any) => data.data.map((item) => this.routineAdapter.adapt(item)))
    );
  }

  modifyRoutine(data: any): Observable<any> {
    return this.httpClient.post<any>(environment.api + 'task/routine/modify', data, { headers: this.getHeader() });
  }
}
