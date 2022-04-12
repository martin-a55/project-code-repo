import { Component } from '@angular/core';
import { WebService } from './web.service';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '@auth0/auth0-angular';
import { InsightService } from './insight.service';


@Component({
 selector: 'stockdetails',
 templateUrl: './stockdetails.component.html',
 styleUrls: ['./stockdetails.component.css']
})

export class StockDetailsComponent {
  constructor(public webService: WebService, private formBuilder: FormBuilder, public authService: AuthService, private insight: InsightService) {}
  page : number = 1
  imageType : string = "qrimagestore/";
  locationForm : any; 
  randomNum : number = 1; 

  async ngOnInit() {
    this.insight.logPageView("Locations Page Viewed"); 

    this.insight.logEvent("Locations Page Loaded ");


    this.webService.getStockDetails().subscribe((result : any) => {
      this.details_list = result; 
      
    });

    this.locationForm = this.formBuilder.group({
      location: '',
      warehouse: '',
      rack: '',
      row: '',
      column: ''
    });
  }

  DownloadQR(id : any){
    window.open('https://projectqrstore.blob.core.windows.net/qrimagestore/' + id + '.png')
  } 

  ChangeImage(){
    if(this.imageType == "qrimagestore/"){
      this.imageType = "stockimagestore/";
      this.randomNum = Math.random();
    }
    else
    {
      this.imageType = "qrimagestore/";
      this.randomNum = Math.random();
    } 
  } 
  
  OnLocationSubmit(){
    this.webService.postLocation(this.locationForm.value)
    .subscribe((respones: any ) => {
      this.locationForm.reset();
      this.webService.getStockDetails().subscribe((result : any) => {
        this.details_list = result; 
        
      });
    });
  }

 
  details_list : any = [];  
 }

