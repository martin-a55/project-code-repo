import { Component, Type } from '@angular/core';
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
  detailsForm : any; 
  randomNum : number = 1; 

  async ngOnInit() {
    this.insight.logPageView("All Stock Details Page Viewed"); 

    this.insight.logEvent("All Stock Details Loaded ");


    this.webService.getStockDetails().subscribe((result : any) => {
      this.details_list = result; 
      
    });

    this.detailsForm = this.formBuilder.group({
      name: ['', Validators.required],
      desc: ['', Validators.required],
      reorder: ['', Validators.required],
      max: ['', Validators.required],
      img: new File([""], "noimg"),
    });
  }

  //Downloads the QR code based on ID
  DownloadQR(id : any){
    window.open('https://projectqrstore.blob.core.windows.net/qrimagestore/' + id + '.png')
  } 

  //updates the image between a QR code or the stock image
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
  
  //submits the details form
  OnDetailsSubmit(){
    this.webService.postDetails(this.detailsForm.value)
    .subscribe((respones: any ) => {
      this.detailsForm.reset();
      this.webService.getStockDetails().subscribe((result : any) => {
        this.details_list = result; 
        this.detailsForm.patchValue({
          img: new File([""], "noimg")
        });
      });
    });
  }

  //get the image when the file updates
  onFileChange(event : any) {
    var file = new File([""], "noimg")
    if (event.target.files.length > 0) {
      file = event.target.files[0];
      this.detailsForm.patchValue({
        img: file
        
      });
    }
    else
    {
      this.detailsForm.patchValue({
        img: file
      });
    }
  }

  //Gets the correct alt text for alt text
  getCorrectAltText(desc : any){
    if(this.imageType == "qrimagestore/"){
      return "A QR code for the assosiated stock details entry";
    }
    else{
      return desc; 
    }
  }

  //checks if the details form is valid
  isDetailsInvalid(control: any) {
    return this.detailsForm.controls[control].invalid &&
            this.detailsForm.controls[control].touched;
   }

   //checks if the details form is untouched
  isDetailsUntouched() {
    return this.detailsForm.controls.name.pristine ||
            this.detailsForm.controls.desc.pristine ||
            this.detailsForm.controls.max.pristine ||
            this.detailsForm.controls.reorder.pristine;     
  }

  //checks if the detials form is complete
    isDetailsIncomplete() {
      return this.isDetailsInvalid('name') ||
      this.isDetailsInvalid('desc') ||
      this.isDetailsInvalid('reorder') ||
      this.isDetailsInvalid('max') ||
      this.isDetailsUntouched(); 
    }

 
  details_list : any = [];  
 }

