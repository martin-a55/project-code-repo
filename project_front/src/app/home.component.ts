import { Component } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { WebService } from './web.service';
import { InsightService } from './insight.service';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
 selector: 'home',
 templateUrl: './home.component.html',
 styleUrls: ['./home.component.css']
})

export class HomeComponent {
    constructor(public authService: AuthService, public webService: WebService, private insight: InsightService, private route: ActivatedRoute, public router: Router) {}

    deniedLoginMessage: any = "";

    ngOnInit() {
        this.insight.logPageView("Home Page Viewed"); 

        this.insight.logEvent("Home Page Loaded ");

        this.route.queryParams
        .subscribe((respones: any ) => {
            if(respones.access == "denied"){
                this.deniedLoginMessage = "This email or domain is not permitted access, ensure your details are correct or contact your administrator"
            }
        
        })
        
    }
}
    

   

