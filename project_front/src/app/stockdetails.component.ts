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
    this.insight.logPageView("Locations Page Viewed"); 

    this.insight.logEvent("Locations Page Loaded ");


    this.webService.getStockDetails().subscribe((result : any) => {
      this.details_list = result; 
      
    });

    this.detailsForm = this.formBuilder.group({
      name: ['', Validators.required],
      desc: ['', Validators.required],
      reorder: ['', Validators.required],
      img: new File([""], "noimg"),
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

  getCorrectAltText(desc : any){
    if(this.imageType == "qrimagestore/"){
      return "A QR code for the assosiated stock details entry";
    }
    else{
      return desc; 
    }
  }

  
  isDetailsInvalid(control: any) {
    return this.detailsForm.controls[control].invalid &&
            this.detailsForm.controls[control].touched;
   }

  isDetailsUntouched() {
    return this.detailsForm.controls.name.pristine ||
            this.detailsForm.controls.desc.pristine ||
            this.detailsForm.controls.reorder.pristine;     
  }

    isDetailsIncomplete() {
      return this.isDetailsInvalid('name') ||
      this.isDetailsInvalid('desc') ||
      this.isDetailsInvalid('reorder') ||
      this.isDetailsUntouched(); 
    }

 
  details_list : any = [];  
 }

