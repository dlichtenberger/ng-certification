import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class WeatherService {
  private readonly APP_ID = '5a4b2d457ecbef9eb2a71e480b947604';

  constructor(private http: HttpClient) {}

  loadByZip(zipCode: string): Observable<WeatherReport> {
    return this.http.get<WeatherReport>(
      `https://api.openweathermap.org/data/2.5/weather?zip=${zipCode}&appid=${this.APP_ID}`
    );
  }
}

export interface WeatherReport {
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
