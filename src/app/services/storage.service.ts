import { Injectable } from '@angular/core';

const TOKEN_KEY = 'community_token_1';
const COMMUNITY_KEY = 'active_community_id_1';
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

  setCurrentCommunity(value: number) {
    localStorage.setItem(COMMUNITY_KEY, value.toString());
  }

  getCurrentCommunity(): number {
    return Number(localStorage.getItem(COMMUNITY_KEY));
  }

  removeCurrentCommunity() {
    localStorage.removeItem(COMMUNITY_KEY);
  }
}
