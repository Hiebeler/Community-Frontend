import { Injectable } from '@angular/core';

const TOKEN_KEY = 'community_token_1';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  private token: string = null;

  constructor() {
    this.init();
  }

  async init() {
    this.token = localStorage.getItem(TOKEN_KEY);
  }

  setToken(value: any) {
    localStorage.setItem(TOKEN_KEY, value);
  }

  getToken() {
    return localStorage.getItem(TOKEN_KEY);
  }

  removeToken() {
    localStorage.removeItem(TOKEN_KEY);
  }

  setTokenString(value: string){
    this.token = value;
  }

  getTokenString(){
    return this.token;
  }
}
