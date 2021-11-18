import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Forecast, WeatherService } from '../weather.service';

@Component({
  selector: 'app-forecast',
  templateUrl: './forecast.component.html',
})
export class ForecastComponent implements OnInit {
  forecast: Forecast = {
    valid: false,
    zipCode: '',
    name: '',
    weather: [],
  };

  constructor(
    private route: ActivatedRoute,
    private weatherService: WeatherService
  ) {}

  ngOnInit() {
    let zipCode = this.route.snapshot.paramMap.get('zipCode');
    this.weatherService
      .forecastByZip(zipCode)
      .subscribe((forecast) => (this.forecast = forecast));
  }
}
