import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class WeatherService {
  private readonly APP_ID = '5a4b2d457ecbef9eb2a71e480b947604';

  constructor(private http: HttpClient) {}

  loadByZip(zipCode: string): Observable<WeatherReport> {
    return this.getReportForZip(zipCode).pipe(
      map((response) => ({
        zipCode: zipCode,
        name: response.name,
        conditions: response.weather[0].main,
        icon: CONDITION_ICONS[response.weather[0].main] || WeatherIcon.SUN,
        temperature: {
          minimum: response.main.temp_min,
          maximum: response.main.temp_max,
          current: response.main.temp,
        },
      }))
    );
  }

  private getReportForZip(zipCode: string): Observable<WeatherResponse> {
    return this.http.get<WeatherResponse>(
      `https://api.openweathermap.org/data/2.5/weather?zip=${zipCode}&appid=${this.APP_ID}&units=imperial`
    );
  }
}

export interface WeatherReport {
  zipCode: string;
  name: string;
  conditions: string;
  icon: WeatherIcon;
  temperature: {
    minimum: number;
    maximum: number;
    current: number;
  };
}

export enum WeatherIcon {
  SUN = 'https://www.angulartraining.com/images/weather/sun.png',
  SNOW = 'https://www.angulartraining.com/images/weather/snow.png',
  RAIN = 'https://www.angulartraining.com/images/weather/rain.png',
  CLOUDS = 'https://www.angulartraining.com/images/weather/clouds.png',
}

// based on https://openweathermap.org/weather-conditions#Weather-Condition-Codes-2
const CONDITION_ICONS = {
  Clear: WeatherIcon.SUN,
  Snow: WeatherIcon.SNOW,
  Rain: WeatherIcon.RAIN,
  Drizzle: WeatherIcon.RAIN,
  Thunderstorm: WeatherIcon.RAIN,
  Clouds: WeatherIcon.CLOUDS,
  Mist: WeatherIcon.CLOUDS,
};

interface WeatherResponse {
  coord: {
    lon: number;
    lat: number;
  };
  weather: [
    {
      id: number;
      main: string;
      description: string;
      icon: string;
    }
  ];
  base: string;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
  };
  visibility: number;
  wind: {
    speed: number;
    deg: number;
  };
  clouds: {
    all: number;
  };
  dt: number;
  sys: {
    type: number;
    id: number;
    country: string;
    sunrise: number;
    sunset: number;
  };
  timezone: number;
  id: number;
  name: string;
  cod: number;
}
