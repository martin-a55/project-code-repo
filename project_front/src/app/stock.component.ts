import { Component } from '@angular/core';
import { WebService } from './web.service';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '@auth0/auth0-angular';
import { ActivatedRoute} from '@angular/router';


@Component({
 selector: 'stock',
 templateUrl: './stock.component.html',
 styleUrls: ['./stock.component.css']
})

export class StockComponent {
  constructor(public webService: WebService, private formBuilder: FormBuilder, public authService: AuthService, private route: ActivatedRoute,) {}

  page : number = 1

  async ngOnInit() {
    this.location_list = this.webService.getOneStockLocation(this.route.snapshot.params['id']);

    this.webService.getStock(this.route.snapshot.params['id']).subscribe((result : any) => {
      this.stock_list = result; 
      
    });
  }

  
  location_list : any = [];  
  stock_list : any = [];
 }

