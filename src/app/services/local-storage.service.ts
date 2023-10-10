import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  constructor() {
  }

  appName: string = environment.appName;

  getItem(key: string) {
    return localStorage.getItem(`${this.appName}-${key}`);
  }

  setItem(key: string, data: string) {
    return localStorage.setItem(`${this.appName}-${key}`, data);
  }

  removeItem(key: string) {
    return localStorage.removeItem(`${this.appName}-${key}`);
  }

  clear() {
    for (let i = localStorage.length - 1; i >= 0; i--) {
      const key = localStorage.key(i);
      if (key && key.startsWith(`${this.appName}-`)) {
        localStorage.removeItem(key);
      }
    }
  }
}