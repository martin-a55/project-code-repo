import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { WebService } from './web.service';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { HomeComponent } from './home.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthModule } from '@auth0/auth0-angular';
import { NavComponent } from './nav.component';
import { LocationComponent } from './location.component';
import {NgxPaginationModule} from 'ngx-pagination';
import { StockComponent } from './stock.component';
import { InsightService } from './insight.service';
import { AuthGuard } from '@auth0/auth0-angular';

import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthHttpInterceptor } from '@auth0/auth0-angular';


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
  } 
];

@NgModule({
  declarations: [
    AppComponent, HomeComponent, NavComponent, LocationComponent, StockComponent
  ],
  imports: [
    BrowserModule, HttpClientModule, RouterModule.forRoot(routes), ReactiveFormsModule, NgxPaginationModule,
    AuthModule.forRoot( {
      domain:'dev-7zcg37ii.us.auth0.com',
      audience: 'https://project_api/',
      clientId: 'BpdTa5sipFOojHYNJr9QzElCfRHO3BxM',
      httpInterceptor: { allowedList: ['http://localhost:5000/api/v1.0/*'],
    },
      }),
  ],
  providers: [WebService, InsightService, {
    provide: HTTP_INTERCEPTORS, useClass: AuthHttpInterceptor, multi: true,
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
