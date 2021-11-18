import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from '../local-storage.service';
import { WeatherReport, WeatherService } from '../weather.service';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
})
export class OverviewComponent implements OnInit {
  zipCodeInput = '';
  reports: WeatherReport[] = [];

  constructor(
    private localStorage: LocalStorageService,
    private weatherService: WeatherService
  ) {}

  ngOnInit(): void {
    let zipCodes: string[] = this.localStorage.load(STORAGE_ZIP_CODES) || [];
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

  deleteReport(row: WeatherReport) {
    let index = this.reports.indexOf(row);
    if (index === -1) {
      console.warn(`Row not found: ${JSON.stringify(row)}`);
      return;
    }
    this.reports.splice(index, 1);
    this.syncZipCodes();
  }

  private add(zipCode: string) {
    if (this.reports.map((report) => report.zipCode).indexOf(zipCode) !== -1) {
      alert(`ZIP code already shown: ${zipCode}`);
      return;
    }
    this.requestWeatherReport(zipCode);
  }

  private addReport(report: WeatherReport) {
    this.reports.push(report);
    this.reports.sort((a, b) => a.zipCode.localeCompare(b.zipCode));
    this.syncZipCodes();
  }

  private requestWeatherReport(zipCode: string) {
    this.weatherService
      .loadByZip(zipCode)
      .subscribe((data) => this.addReport(data));
  }

  private syncZipCodes() {
    this.localStorage.save(
      STORAGE_ZIP_CODES,
      this.reports.map((report) => report.zipCode)
    );
  }
}

const STORAGE_ZIP_CODES = 'forecastZipCodes';
