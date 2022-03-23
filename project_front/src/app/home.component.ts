import { Component } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { WebService } from './web.service';
import { InsightService } from './insight.service';

@Component({
 selector: 'home',
 templateUrl: './home.component.html',
 styleUrls: ['./home.component.css']
})

export class HomeComponent {
    constructor(public authService: AuthService, public webService: WebService, private insight: InsightService) {}

    ngOnInit() {
        this.insight.logPageView("Home Page Viewed"); 

        this.insight.logEvent("Home Page Loaded ");
    }
}
    

   

