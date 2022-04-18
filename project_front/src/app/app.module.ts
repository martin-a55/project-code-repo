import { NgModule } from '@angular/core';
import { BrowserModule, Title } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { WebService } from './web.service';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { HomeComponent } from './home.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthModule } from '@auth0/auth0-angular';
import { NavComponent } from './nav.component';
import { LocationComponent } from './location.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { StockComponent } from './stock.component';
import { StockDetailsComponent } from './stockdetails.component';
import { SearchComponent } from './search.component';
import { InsightService } from './insight.service';
import { AuthGuard } from '@auth0/auth0-angular';
import { StockDetailComponent } from './stockdetail.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthHttpInterceptor } from '@auth0/auth0-angular';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTooltipModule } from '@angular/material/tooltip';
 
var routes: any = [
  {
    path: '',
    component: HomeComponent
    //, canActivate: [AuthGuard]
    },
  {
    path: 'location',
    component: LocationComponent
    , canActivate: [AuthGuard]
  },
  {
    path : 'location/:id',
    component: StockComponent
    , canActivate: [AuthGuard]
  },
  {
    path : 'stockdetails',
    component: StockDetailsComponent, 
    canActivate: [AuthGuard]
  },
  {
  path : 'stockdetails/:id',
    component: StockDetailComponent, 
    canActivate: [AuthGuard]
  },
  {
  path : 'search',
    component: SearchComponent, 
    canActivate: [AuthGuard]
  }
];

@NgModule({
  declarations: [
    AppComponent, HomeComponent, NavComponent, LocationComponent, StockComponent, StockDetailsComponent, StockDetailComponent, SearchComponent
  ],
  imports: [
    BrowserModule, HttpClientModule, RouterModule.forRoot(routes), ReactiveFormsModule, NgxPaginationModule, MatTooltipModule,
    AuthModule.forRoot( {
      domain:'dev-7zcg37ii.us.auth0.com',
      audience: 'https://project_api/',
      clientId: 'BpdTa5sipFOojHYNJr9QzElCfRHO3BxM',
      httpInterceptor: { allowedList: ['http://localhost:5000/api/v1.0/*', 'https://stockprojectapi.azurewebsites.net/api/v1.0/*'],
    },
      }),
    BrowserAnimationsModule,
  ],
  providers: [WebService, Title, InsightService, {
    provide: HTTP_INTERCEPTORS, useClass: AuthHttpInterceptor, multi: true,
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
