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




var routes: any = [
  {
    path: '',
    component: HomeComponent
    },
  {
    path: 'location',
    component: LocationComponent
  },
  {
  path : 'location/:id',
  component: StockComponent
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
      clientId: 'HjQRaWRFhKwwVRZKJj0e5haq9mKTVlLT'
      })
  ],
  providers: [WebService],
  bootstrap: [AppComponent]
})
export class AppModule { }
