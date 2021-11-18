import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { ReportComponent } from './report/report.component';
import { HerokuWeatherService, WeatherService } from './weather.service';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app-routing/app-routing.module';
import { ForecastComponent } from './forecast/forecast.component';
import { OverviewComponent } from './overview/overview.component';


@NgModule({
  imports: [BrowserModule, FormsModule, HttpClientModule, AppRoutingModule],
  declarations: [AppComponent, ReportComponent, ForecastComponent, OverviewComponent],
  bootstrap: [AppComponent],
  providers: [
    WeatherService,
    //{ provide: WeatherService, useClass: HerokuWeatherService }
  ],
})
export class AppModule {}
