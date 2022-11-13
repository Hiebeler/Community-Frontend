import { Injectable } from '@angular/core';

const TOKEN_KEY = 'community_token_1';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }

  setToken(value: any) {
    localStorage.setItem(TOKEN_KEY, value);
  }

  getToken() {
    return localStorage.getItem(TOKEN_KEY);
  }

  removeToken() {
    localStorage.removeItem(TOKEN_KEY);
  }
}
