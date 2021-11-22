import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { LocalStorageService } from '../local-storage.service';
import { WeatherReport, WeatherService } from '../weather.service';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
})
export class OverviewComponent implements OnInit {
  zipCodeInput = '';

  // list of displayed weather reports
  reports: WeatherReport[] = [];

  // stored ZIP codes
  private zipCodes: string[] = [];

  constructor(
    private localStorage: LocalStorageService,
    private weatherService: WeatherService
  ) {}

  ngOnInit(): void {
    this.zipCodes = this.localStorage.load(STORAGE_ZIP_CODES) || [];

    // load weather reports in parallel, show page when all are available
    forkJoin(
      this.zipCodes.map((zipCode) => this.weatherService.loadByZip(zipCode))
    ).subscribe((result) => this.setReports(result));
  }

  // add the entered ZIP code
  addZipCode() {
    if (this.zipCodeInput) {
      let trimmed = this.zipCodeInput.trim();
      if (trimmed) {
        this.add(trimmed);
      }
    }
  }

  // remove a ZIP code from list of weather reports
  deleteReport(row: WeatherReport) {
    let index = this.reports.indexOf(row);
    if (index === -1) {
      console.warn(`Row not found: ${JSON.stringify(row)}`);
      return;
    }
    this.reports.splice(index, 1);

    // also remove from stored ZIP codes
    let zipIndex = this.zipCodes.indexOf(row.zipCode);
    if (zipIndex !== -1) {
      this.zipCodes.splice(this.zipCodes.indexOf(row.zipCode), 1);
      this.syncZipCodes();
    }
  }

  private add(zipCode: string) {
    // don't allow to add a ZIP code teice
    if (this.zipCodes.indexOf(zipCode) !== -1) {
      alert(`ZIP code already shown: ${zipCode}`);
      return;
    }

    this.weatherService.loadByZip(zipCode).subscribe((data) => {
      if (data.valid) {
        // only add valid ZIP codes
        this.zipCodes.push(zipCode);
        this.syncZipCodes();

        // reset UI
        this.zipCodeInput = '';

        // add to list
        this.addReport(data);
      } else {
        alert(`Failed to add ZIP code: ${data.errorMessage}`);
      }
    });
  }

  private addReport(report: WeatherReport) {
    this.reports.push(report);
    this.sortReports();
  }

  private setReports(reports: WeatherReport[]): void {
    this.reports = reports;
    this.sortReports();
  }

  private sortReports(): void {
    this.reports.sort((a, b) => a.zipCode.localeCompare(b.zipCode));
  }

  private syncZipCodes() {
    this.localStorage.save(STORAGE_ZIP_CODES, this.zipCodes);
  }
}

const STORAGE_ZIP_CODES = 'forecastZipCodes';
