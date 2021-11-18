import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from '../app.component';
import { ForecastComponent } from '../forecast/forecast.component';
import { OverviewComponent } from '../overview/overview.component';

const routes: Routes = [
  { path: 'forecast/:zipCode', component: ForecastComponent },
  { path: '', component: OverviewComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
