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


var routes: any = [
  {
    path: '',
    component: HomeComponent
    }
];

@NgModule({
  declarations: [
    AppComponent, HomeComponent, NavComponent
  ],
  imports: [
    BrowserModule, HttpClientModule, RouterModule.forRoot(routes), ReactiveFormsModule,
    AuthModule.forRoot( {
      domain:'dev-7zcg37ii.us.auth0.com',
      clientId: 'HjQRaWRFhKwwVRZKJj0e5haq9mKTVlLT'
      })
  ],
  providers: [WebService],
  bootstrap: [AppComponent]
})
export class AppModule { }
