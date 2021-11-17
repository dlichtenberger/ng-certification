import { Component } from '@angular/core';
import { LocalStorageService } from './local-storage.service';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  name = 'Angular';

  zipCodeInput = '';
  zipCodes: string[] = [];

  constructor(private localStorage: LocalStorageService) {
    this.zipCodes = localStorage.load(STORAGE_ZIP_CODES) || [];
  }

  addZipCode() {
    if (this.zipCodeInput) {
      let trimmed = this.zipCodeInput.trim();
      if (trimmed) {
        this.zipCodes.push(trimmed);
        this.syncZipCodes();
      }
    }
  }

  private syncZipCodes() {
    this.localStorage.save(STORAGE_ZIP_CODES, this.zipCodes);
  }
}

const STORAGE_ZIP_CODES = 'forecastZipCodes';
