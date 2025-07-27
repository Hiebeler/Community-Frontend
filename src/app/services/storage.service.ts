import { Injectable } from '@angular/core';

const TOKEN_KEY = 'community_token_12';
const COMMUNITY_KEY = 'active_community_id_12';
@Injectable({
  providedIn: 'root',
})
export class StorageService {
  constructor() {}

  setToken(value: string): void {
    localStorage.setItem(TOKEN_KEY, value);
  }

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  removeToken(): void {
    localStorage.removeItem(TOKEN_KEY);
  }

  setCurrentCommunity(value: number): void {
    localStorage.setItem(COMMUNITY_KEY, value.toString());
  }

  getCurrentCommunity(): number | null {
    const value = localStorage.getItem(COMMUNITY_KEY);
    return value !== null ? Number(value) : null;
  }

  removeCurrentCommunity(): void {
    localStorage.removeItem(COMMUNITY_KEY);
  }
}
