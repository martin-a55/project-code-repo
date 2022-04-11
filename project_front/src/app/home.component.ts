import { Component } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { WebService } from './web.service';
import { InsightService } from './insight.service';
import { ActivatedRoute } from '@angular/router';


@Component({
 selector: 'home',
 templateUrl: './home.component.html',
 styleUrls: ['./home.component.css']
})

export class HomeComponent {
    constructor(public authService: AuthService, public webService: WebService, private insight: InsightService, private route: ActivatedRoute) {}

    deniedLoginMessage: any = "";

    ngOnInit() {
        this.insight.logPageView("Home Page Viewed"); 

        this.insight.logEvent("Home Page Loaded ");

        this.route.queryParams
        .subscribe((respones: any ) => {
            if(respones.access == "denied"){
                this.deniedLoginMessage = "Email not recognised, make sure you entered it correctly or that your admin has given it access"
            }
        
        })
        
    }
}
    

   

