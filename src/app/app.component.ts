import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { LocalStorageService } from './local-storage.service';
import { WeatherReport, WeatherService } from './weather.service';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  name = 'Angular';

  zipCodeInput = '';
  reports: WrappedReport[] = [];

  constructor(
    private localStorage: LocalStorageService,
    private weatherService: WeatherService
  ) {
    let zipCodes: string[] = localStorage.load(STORAGE_ZIP_CODES) || [];
    for (let zipCode of zipCodes) {
      this.requestWeatherReport(zipCode);
    }
  }

  addZipCodeInput() {
    if (this.zipCodeInput) {
      let trimmed = this.zipCodeInput.trim();
      if (trimmed) {
        this.add(trimmed);
      }
    }
  }

  deleteReport(row: WrappedReport) {
    this.reports.splice(this.reports.indexOf(row), 1);
    this.syncZipCodes();
  }

  private add(zipCode: string) {
    if (this.reports.map((report) => report.zipCode).indexOf(zipCode) !== -1) {
      alert(`ZIP code already shown: ${zipCode}`);
      return;
    }
    this.requestWeatherReport(zipCode);
  }

  private addReport(report: WrappedReport) {
    this.reports.push(report);
    this.reports.sort((a, b) => a.zipCode.localeCompare(b.zipCode));
    this.syncZipCodes();
  }

  private requestWeatherReport(zipCode: string) {
    this.weatherService.loadByZip(zipCode).subscribe({
      next: (data) => this.addReport({ zipCode: zipCode, report: data }),
      error: (_error) =>
        alert(`Failed to retrieve weather information for ZIP code ${zipCode}`),
    });
  }

  private syncZipCodes() {
    this.localStorage.save(
      STORAGE_ZIP_CODES,
      this.reports.map((report) => report.zipCode)
    );
  }
}

interface WrappedReport {
  zipCode: string;
  report: WeatherReport;
}

const STORAGE_ZIP_CODES = 'forecastZipCodes';
