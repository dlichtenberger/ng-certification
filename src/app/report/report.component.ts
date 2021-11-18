import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { WeatherReport } from '../weather.service';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
})
export class ReportComponent implements OnInit {
  @Input()
  report: WeatherReport;

  @Output()
  delete = new EventEmitter<WeatherReport>();

  constructor() {}

  ngOnInit() {}
}
