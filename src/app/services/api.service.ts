import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { CommunityAdapter } from '../adapter/community-adapter';
import { UserAdapter } from '../adapter/user-adapter';
import { Community } from '../models/community';
import { User } from '../models/user';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(
    private httpClient: HttpClient,
    private storageService: StorageService,
    private userAdapter: UserAdapter,
    private communityAdapter: CommunityAdapter
    ) { }

  getHeader(): HttpHeaders {
    const headers = new HttpHeaders({
      // eslint-disable-next-line @typescript-eslint/naming-convention
      'Content-Type': 'application/json; charset=utf-8',
      // eslint-disable-next-line @typescript-eslint/naming-convention
      Authorization: 'Bearer ' + this.storageService.getTokenString()
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

  updateUser(data: any): Observable<any> {
    return this.httpClient.post<any>(environment.api + 'user/changedata', data, { headers: this.getHeader() });
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

  uploadImage(file: any): Observable<any> {
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
}
