import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

abstract class AbstractWeatherService {
  constructor(protected http: HttpClient) {}

  loadByZip(zipCode: string): Observable<WeatherReport> {
    return this.getReportForZip(zipCode).pipe(
      // convert successful responses to WeatherReport
      map((response) => ({
        valid: true,
        zipCode: zipCode,
        name: response.name,
        conditions: response.weather[0].main,
        icon: CONDITION_ICONS[response.weather[0].main] || WeatherIcon.SUN,
        temperature: {
          minimum: response.main.temp_min,
          maximum: response.main.temp_max,
          current: response.main.temp,
        },
      })),

      // map error responses to 'error' object in result list
      catchError((error) =>
        of({
          valid: false,
          zipCode: zipCode,
          errorMessage: `${error.status} - ${error.error?.message}`,
          name: '',
          conditions: '',
          icon: WeatherIcon.SUN,
          temperature: {
            minimum: -1,
            maximum: -1,
            current: -1,
          },
        })
      )
    );
  }

  forecastByZip(zipCode: string): Observable<Forecast> {
    return this.getForecastForZip(zipCode).pipe(
      // convert successful responses to Forecast
      map((response) => ({
        valid: true,
        name: response.city.name,
        zipCode: zipCode,
        weather: this.toForecastEntries(response),
      }))
    );
  }

  private toForecastEntries(response: ForecastResponse): ForecastEntry[] {
    let today = new Date();

    let entries: ForecastEntry[] = response.list.map((entry) => ({
      date: new Date(entry.dt * 1000),
      conditions: entry.weather[0].main,
      icon: CONDITION_ICONS[entry.weather[0].main] || WeatherIcon.SUN,
      temperature: {
        minimum: entry.main.temp_min,
        maximum: entry.main.temp_max,
      },
    }));

    let result: ForecastEntry[] = [];
    for (let entry of entries) {
      console.log(entry.date.getUTCHours());
      if (
        entry.date.getDay() !== today.getDay() &&
        entry.date.getUTCHours() === 12
      ) {
        result.push(entry);
      }
    }

    return result;
  }

  protected abstract getReportForZip(
    zipCode: string
  ): Observable<WeatherResponse>;

  protected abstract getForecastForZip(
    zipCode: string
  ): Observable<ForecastResponse>;
}

@Injectable()
export class WeatherService extends AbstractWeatherService {
  private readonly API_URL = 'https://api.openweathermap.org/data/2.5';
  private readonly APP_ID = '5a4b2d457ecbef9eb2a71e480b947604';

  constructor(protected http: HttpClient) {
    super(http);
  }

  protected getReportForZip(zipCode: string): Observable<WeatherResponse> {
    return this.http.get<WeatherResponse>(
      `${this.API_URL}/weather?zip=${zipCode}&appid=${this.APP_ID}&units=imperial`
    );
  }

  protected getForecastForZip(zipCode: string): Observable<ForecastResponse> {
    return this.http.get<ForecastResponse>(
      `${this.API_URL}/forecast?zip=${zipCode}&appid=${this.APP_ID}&units=imperial`
    );
  }
}

@Injectable()
export class HerokuWeatherService extends AbstractWeatherService {
  private readonly API_URL = 'https://lp-store.herokuapp.com';

  constructor(protected http: HttpClient) {
    super(http);
  }

  protected getReportForZip(zipCode: string): Observable<WeatherResponse> {
    return this.http.get<WeatherResponse>(
      `${this.API_URL}/weather?zipCode=${zipCode}`
    );
  }

  protected getForecastForZip(zipCode: string): Observable<ForecastResponse> {
    return of();
  }
}

export interface WeatherReport {
  zipCode: string;
  valid: boolean;
  errorMessage?: string;

  name: string;
  conditions: string;
  icon: WeatherIcon;
  temperature: {
    minimum: number;
    maximum: number;
    current: number;
  };
}

export interface Forecast {
  zipCode: string;
  name: string;
  valid: boolean;
  weather: ForecastEntry[];
}

export interface ForecastEntry {
  date: Date;
  conditions: string;
  icon: WeatherIcon;
  temperature: {
    minimum: number;
    maximum: number;
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

interface ForecastResponse {
  cod: number;
  message: number;
  cnt: number;
  list: Array<{
    dt: number;
    main: {
      temp: number;
      feels_like: number;
      temp_min: number;
      temp_max: number;
      pressure: number;
      sea_level: number;
      grnd_level: number;
      humidity: number;
      temp_kf: number;
    };
    weather: [
      {
        id: number;
        main: string;
        description: string;
        icon: string;
      }
    ];
    clouds: {
      all: number;
    };
    wind: {
      speed: number;
      deg: number;
      gust: number;
    };
    visibility: number;
    pop: number;
    rain: {
      [duration: string]: number;
    };
  }>;
  city: {
    id: number;
    name: string;
    coord: {
      lat: number;
      lon: number;
    };
    country: string;
    population: number;
    timezone: number;
    sunrise: number;
    sunset: number;
  };
}
