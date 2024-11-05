import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Preferences } from '@capacitor/preferences';


@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  constructor() {
  }

  appName: string = environment.appName;

  async setItem (key: string, value: string)  {
    await Preferences.set({
      key: `${this.appName}-${key}`,
      value: value
    });
  };

  async setString(key: string, value: string) {
    await Preferences.set({
      key: `${this.appName}-${key}`,
      value: value
    });
  }

  async getString(key: string): Promise<string | null> {
    const ret = await Preferences.get({ key: `${this.appName}-${key}` });
    return ret.value;
  }

  async setObject (key: string, value: any)  {
    await Preferences.set({
      key: `${this.appName}-${key}`,
      value: JSON.stringify(value),
    });
  };

  async getObject(key: string): Promise<any> {
    const ret = await Preferences.get({ key: `${this.appName}-${key}` });
    return JSON.parse(ret.value!);
  }

  async removeItem(key: string) {
    await Preferences.remove({ key: `${this.appName}-${key}` });
  }

/*
  getItem(key: string) {
    return localStorage.getItem(`${this.appName}-${key}`);
  }
*/
  /*
  setItem(key: string, data: string) {
    return localStorage.setItem(`${this.appName}-${key}`, data);
  }
  */

  /*
  removeItem(key: string) {
    return localStorage.removeItem(`${this.appName}-${key}`);
  }
*/

  async clear() {
    await Preferences.clear();
  }
}