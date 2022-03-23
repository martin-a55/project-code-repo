import { Component } from '@angular/core';
import { WebService } from './web.service';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '@auth0/auth0-angular';
import { InsightService } from './insight.service';


@Component({
 selector: 'location',
 templateUrl: './location.component.html',
 styleUrls: ['./location.component.css']
})

export class LocationComponent {
  constructor(public webService: WebService, private formBuilder: FormBuilder, public authService: AuthService, private insight: InsightService) {}
  page : number = 1
  locationForm : any; 

  async ngOnInit() {
    this.insight.logPageView("Locations Page Viewed"); 

    this.insight.logEvent("Locations Page Loaded ");


    this.webService.getStockLoactions().subscribe((result : any) => {
      this.location_list = result; 
      
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

  OnLocationSubmit(){
    this.webService.postLocation(this.locationForm.value)
    .subscribe((respones: any ) => {
      this.locationForm.reset();
      this.webService.getStockLoactions().subscribe((result : any) => {
        this.location_list = result; 
        
      });
    });
  }

 
  location_list : any = [];  
 }

