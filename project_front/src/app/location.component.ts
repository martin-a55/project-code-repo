import { Component } from '@angular/core';
import { WebService } from './web.service';
import { FormBuilder, RequiredValidator, Validators } from '@angular/forms';
import { AuthService } from '@auth0/auth0-angular';
import { InsightService } from './insight.service';


@Component({
 selector: 'location',
 templateUrl: './location.component.html',
 styleUrls: ['./location.component.css']
})

export class LocationComponent {
  constructor(public webService: WebService, private formBuilder: FormBuilder, public authService: AuthService, private insight: InsightService) {}
  page : number = 1;
  locationForm : any; 

  async ngOnInit() {
    this.insight.logPageView("Locations Page Viewed"); 

    this.insight.logEvent("Locations Page Loaded ");


    this.webService.getStockLoactions().subscribe((result : any) => {
      this.location_list = result; 
      
    });

    this.locationForm = this.formBuilder.group({
      location: ['', Validators.required],
      warehouse: ['', Validators.required],
      rack: ['', Validators.required],
      row: ['', Validators.required],
      column: ['', Validators.required]
    });
  }

  //downloads a QR based on given ID
  DownloadQR(id : any){
    window.open('https://projectqrstore.blob.core.windows.net/qrimagestore/' + id + '.png')
  }

  //submits the location form details as well as reseting the form and refreshing the location list
  OnLocationSubmit(){
    this.webService.postLocation(this.locationForm.value)
    .subscribe((respones: any ) => {
      this.locationForm.reset();
      this.webService.getStockLoactions().subscribe((result : any) => {
        this.location_list = result; 
        
      });
    });
  }

  //checks if the location form is valid
  isLocationInvalid(control: any) {
    return this.locationForm.controls[control].invalid &&
            this.locationForm.controls[control].touched;
   }

  //checks if the location form is untouched
  isLocationUntouched() {
    return this.locationForm.controls.location.pristine ||
            this.locationForm.controls.warehouse.pristine ||
            this.locationForm.controls.rack.pristine ||
            this.locationForm.controls.row.pristine ||
            this.locationForm.controls.column.pristine;      
  }

  //checks if the location form is incomplete
    isLocationIncomplete() {
      return this.isLocationInvalid('location') ||
      this.isLocationInvalid('warehouse') ||
      this.isLocationInvalid('rack') ||
      this.isLocationInvalid('row') ||
      this.isLocationInvalid('column') ||
      this.isLocationUntouched(); 
    }

 
  location_list : any = [];  
 }

