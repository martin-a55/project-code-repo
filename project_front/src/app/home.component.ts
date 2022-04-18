import { Component, ElementRef } from '@angular/core';
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
    constructor(public authService: AuthService, public webService: WebService, private insight: InsightService, private route: ActivatedRoute, public router: Router, private elementRef: ElementRef) {}

    deniedLoginMessage: any = "";
    isReorder: Boolean = false; 
    isMaxstock: Boolean = false; 
    isStock: Boolean = false; 
    reorderPage: number = 1;
    maxPage: number = 1;
    amountPage: number = 1; 
    

    ngOnInit() {
        this.insight.logPageView("Home Page Viewed"); 
        this.insight.logEvent("Home Page Loaded ");

        this.webService.getReorder().subscribe((result : any) => {
            this.reorder_list = result; 
            if(this.reorder_list.length != 0){
                this.isReorder = true; 
            }
          });

          this.webService.getMaxStock().subscribe((result : any) => {
            this.max_stock_list = result; 
            if(this.max_stock_list.length != 0){
                this.isMaxstock = true; 
            }
          });

          this.webService.getStockAmount().subscribe((result : any) => {
            this.stock_amount_list = result; 
            if(this.stock_amount_list != 0){
                this.isStock = true; 
            }
          });

        this.route.queryParams
        .subscribe((respones: any ) => {
            if(respones.access == "denied"){
                this.deniedLoginMessage = "This email or domain is not permitted access, ensure your details are correct or contact your administrator"
            }
        })
    }

    reorder_list : any = [];
    max_stock_list : any = [];
    stock_amount_list: any = []; 
}
    

   

