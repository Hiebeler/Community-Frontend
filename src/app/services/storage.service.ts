import { Injectable } from '@angular/core';

const TOKEN_KEY = 'community_token_1';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() {
    this.init();
  }

  async init() {
    // this.token = localStorage.getItem(TOKEN_KEY);
  }

  setToken(value: any) {
    localStorage.setItem(TOKEN_KEY, value);

    console.log(this.getToken());
  }

  getToken() {
    return localStorage.getItem(TOKEN_KEY);
  }

  removeToken() {
    localStorage.removeItem(TOKEN_KEY);
  }
}
