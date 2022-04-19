import { Component } from '@angular/core';
import { WebService } from './web.service';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '@auth0/auth0-angular';
import { ActivatedRoute, Router} from '@angular/router';
import { InsightService } from './insight.service';


@Component({
 selector: 'stockdetail',
 templateUrl: './stockdetail.component.html',
 styleUrls: ['./stockdetail.component.css']
})

export class StockDetailComponent {
  
  constructor(public webService: WebService, private formBuilder: FormBuilder, public authService: AuthService, private route: ActivatedRoute, private router : Router, private insight: InsightService) {}

  page : number = 1
  editForm: any;
  isStock : boolean = false;
  imageType : string = "qrimagestore/";
  randomNum : number = 1; 
  arrayFrom: any; 

  async ngOnInit() {
    this.insight.logPageView("Stock Detail Page Viewed"); 

    this.insight.logEvent("Stock Detail Page Loaded ");

    this.webService.getOneStockDetails(this.route.snapshot.params['id']).subscribe((result : any) => {
      this.details = result
    });

    this.RefreshStock();
    this.RefreshDetails(); 

    this.editForm = this.formBuilder.group({
      name: ['', Validators.required],
      desc: ['', Validators.required],
      reorder: ['', Validators.required],
      max: ['', Validators.required],
      img: new File([""], "noimg"),
    });


  }

arrayForm = this.formBuilder.group({
    stock: this.formBuilder.array([])
})

  
//Downloads the QR code based on ID
  DownloadQR(id : any){
    window.open('https://projectqrstore.blob.core.windows.net/qrimagestore/' + id + '.png')
  }

  //Toggles the edit boolean
  onToggleEdit(){
    if(this.toggleEdit){
      this.toggleEdit = false
    }
    else{
      this.toggleEdit = true
    }
  }

  //Submits the edit form and updates the form
  OnEditSubmit(){
    this.webService.updateDetails(this.editForm.value, this.route.snapshot.params['id'])
    .subscribe((respones: any ) => {
      this.webService.getOneStockDetails(this.route.snapshot.params['id']).subscribe((result : any) => {
        this.details = result
        this.toggleEdit = true
        this.editForm.patchValue({
          img: new File([""], "")
        });
        this.RefreshStock(); 
      });
    });
    
  }

  //deletes the stock detaisl
  OnDeleteDetails(){
    this.webService.deleteDetails(this.route.snapshot.params['id']).subscribe(() => {
      this.router.navigateByUrl("/stockdetails");
    }); 
  }

  //deletes the stock
  OnDeleteStock(lid:any, sid: any){
    this.webService.deleteStock(lid, sid).subscribe(() => {
      this.RefreshStock();
    }); 
  }

  //Refresh the stock and the edit array form  
  RefreshStock(){
    this.webService.getStockByDetails(this.route.snapshot.params['id']).subscribe((result : any) => {
      this.stock_list = result; 
      this.toggleStockEdit = true;
      this.RefreshDetails();
      if(this.stock_list.length != 0){
          this.isStock = true;
          this.ClearFormArray(this.stockEdit); 
          this.stock_list.forEach((stock : any) => {
            var stockEditForm = this.formBuilder.group({
              details: [stock["details"], Validators.required],
              qty: [stock['quantity'], Validators.required]
            });
            this.stockEdit.push(stockEditForm);
          }); 
          
      }
      else{
        this.isStock = false;
      }
    });
  }

  //refreshs the stock details
  RefreshDetails(){
    this.webService.getStockDetails().subscribe((result : any) => {
      this.stock_details = result; 
      });
  }

  //get the image when the file updates
  onFileChange(event : any) {
    var file = new File([""], "noimg")
    if (event.target.files.length > 0) {
      file = event.target.files[0];
      this.editForm.patchValue({
        img: file
        
      });
    }
    else
    {
      this.editForm.patchValue({
        img: file
      });
    }
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

  //Gets the correct alt text for alt text
  getCorrectAltText(desc : any){
    if(this.imageType == "qrimagestore/"){
      return "A QR code for the assosiated stock details entry";
    }
    else{
      return desc; 
    }
  }

  //gets the stock form array
  get stockEdit() {
    return this.arrayForm.controls["stock"] as FormArray;
  }

  //adds a new stock from to the form array
  addStockForm() {
    const stockEditForm = this.formBuilder.group({
        quantity: ['']
    });
  
    this.stockEdit.push(stockEditForm);
  }

  //get the form control from the from array
  getFormControl(id: any){
    var actual_id = (12 * (this.page -1)) + id;
    return this.stockEdit.at(actual_id) as FormGroup; 
  }

  //toggles between the stock array
  onToggleStockEdit(){
    if(this.toggleStockEdit){
      this.toggleStockEdit = false 
    }
    else{
      this.toggleStockEdit = true
    }
  }

  //submits the stock edit form and refresh the stock
  OnEditStockSubmit(lid: any, sid: any, id: any){
    this.webService.updateStock(this.getFormControl(id).value, lid, sid)
    .subscribe((respones: any ) => {
        this.RefreshStock();
    });
  }

  //clears the form array
  ClearFormArray(array: FormArray){
    while (array.length != 0) {
      array.removeAt(0)
    }
  }

  //checks is the stock form is valid
  isStockEditInvalid(control: any, id: any) {
      return this.getFormControl(id).controls[control].invalid &&
              this.getFormControl(id).controls[control].touched;
  }
  
  //checks the stock edit form
  isStockEditIncomplete(id: any) {
        return this.isStockEditInvalid('details', id) ||
        this.isStockEditInvalid('qty', id);
        
  }

  //checks if details form are valid
  isDetailsInvalid(control: any) {
    return this.editForm.controls[control].invalid &&
            this.editForm.controls[control].touched;
   }

   //checks if details are incomplete
  isDetailsIncomplete() {
      return this.isDetailsInvalid('name') ||
      this.isDetailsInvalid('desc') ||
      this.isDetailsInvalid('max') ||
      this.isDetailsInvalid('reorder'); 
    }
  

  toggleEdit: boolean = true;
  toggleStockEdit: boolean = true; 
  details : any;  
  stock_list : any = [];
  stock_details : any = [];
  
 }

 