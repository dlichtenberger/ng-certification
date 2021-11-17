import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  private storage: Storage;

  constructor() {
    this.storage = window.localStorage;
  }

  load<T>(key: string): T {
    return JSON.parse(this.storage.getItem(key)) as T;
  }

  save<T>(key: string, value: T) {
    this.storage.setItem(key, JSON.stringify(value));
  }
}
