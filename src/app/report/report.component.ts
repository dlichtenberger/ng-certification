import { Component, Input, OnInit } from '@angular/core';
import { WeatherReport } from '../weather.service';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
})
export class ReportComponent implements OnInit {
  @Input()
  report: WeatherReport;

  @Input()
  zipCode: string;

  constructor() {}

  ngOnInit() {}
}
