import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Forecast, WeatherService } from '../weather.service';

@Component({
  selector: 'app-forecast',
  templateUrl: './forecast.component.html',
})
export class ForecastComponent implements OnInit {
  // initialize page with empty forecast
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
    // retrieve ZIP code from URI parameter and request forecase
    let zipCode = this.route.snapshot.paramMap.get('zipCode');
    this.weatherService
      .forecastByZip(zipCode)
      .subscribe((forecast) => (this.forecast = forecast));
  }
}
