import { Component } from '@angular/core';
import { WebService } from './web.service';
import { FormArray, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '@auth0/auth0-angular';
import { ActivatedRoute, Router} from '@angular/router';
import { InsightService } from './insight.service';


@Component({
 selector: 'stock',
 templateUrl: './stock.component.html',
 styleUrls: ['./stock.component.css']
})

export class StockComponent {
  
  constructor(public webService: WebService, private formBuilder: FormBuilder, public authService: AuthService, private route: ActivatedRoute, private router : Router, private insight: InsightService) {}

  page : number = 1
  editForm: any;
  stockForm : any;
  isStock : boolean = false;
  arrayForm: any; 

  async ngOnInit() {
    this.insight.logPageView("Stock Page Viewed"); 

    this.insight.logEvent("Stock Page Loaded ");


    this.webService.getOneStockLocation(this.route.snapshot.params['id']).subscribe((result : any) => {
      this.location = result
    });
    
     this.webService.getStockDetails().subscribe((result: any) => {
      this.stock_details = result; 
    }); 

    this.RefreshStock();

    this.editForm = this.formBuilder.group({
      location: ['', Validators.required],
      warehouse: ['', Validators.required],
      rack: ['', Validators.required],
      row: ['', Validators.required],
      column: ['', Validators.required]
    });

    this.stockForm = this.formBuilder.group({
      details: ['', Validators.required],
      qty: ['', Validators.required]
    });

    this.arrayForm = this.formBuilder.group({
      stock: this.formBuilder.array([])
    })
  }

  
 //Downloads the QR code based on the given ID
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

  //Submits edit form and update location details
  OnEditSubmit(){
    this.webService.updateLocation(this.editForm.value, this.route.snapshot.params['id'])
    .subscribe((respones: any ) => {
      
      this.webService.getOneStockLocation(this.route.snapshot.params['id']).subscribe((result : any) => {
        this.location = result
        this.toggleEdit = true
      });
    });
  }

  //Submits stock form and update stock details
  OnStockSubmit(){
    this.webService.postStock(this.stockForm.value, this.route.snapshot.params['id'])
    .subscribe((respones: any ) => {
      this.stockForm.reset(); 
      this.webService.getOneStockLocation(this.route.snapshot.params['id']).subscribe((result : any) => {
        this.RefreshStock();
      });
    });
  }

  //delete location details
  OnDeleteLocation(){
    this.webService.deleteLocation(this.route.snapshot.params['id']).subscribe(() => {
      this.router.navigateByUrl("/location");
    }); 
  }

  //delete stock details
  OnDeleteStock(sid: any){
    this.webService.deleteStock(this.route.snapshot.params['id'], sid).subscribe(() => {
      this.RefreshStock();
    }); 
  }

  //refreshs the stock details and resets the stock edit form array
  RefreshStock(){
    this.webService.getStock(this.route.snapshot.params['id']).subscribe((result : any) => {
      this.stock_list = result; 
      this.toggleStockEdit = true;
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

  //gets the stock edit form for the form array
  get stockEdit() {
    return this.arrayForm.controls["stock"] as FormArray;
  }

  //adds a new stock form to the from array
  addStockForm() {
    const stockEditForm = this.formBuilder.group({
        quantity: ['']
    });
  
    this.stockEdit.push(stockEditForm);
  }

   //gets a stock form to the from array
  getFormControl(id: any){
    var actual_id = (12 * (this.page -1)) + id;   
    return this.stockEdit.at(actual_id) as FormGroup; 
  }

  //toggles edit on the stock form
  onToggleStockEdit(){
    if(this.toggleStockEdit){
      this.toggleStockEdit = false 
    }
    else{
      this.toggleStockEdit = true
    }
  }

  //Submits the stock edit form based on its ID
  OnEditStockSubmit(lid: any, sid: any, id: any){
    this.webService.updateStock(this.getFormControl(id).value, lid, sid)
    .subscribe((respones: any ) => {
        this.RefreshStock();
    });
    
  }

  //Clears the form array
  ClearFormArray(array: FormArray){
    while (array.length != 0) {
      array.removeAt(0)
    }
  }

  //Checks if the location form is valid
  isLocationInvalid(control: any) {
    return this.editForm.controls[control].invalid &&
            this.editForm.controls[control].touched;
   }

  //Checks if the location form is incompelete
  isLocationIncomplete() {
      return this.isLocationInvalid('location') ||
      this.isLocationInvalid('warehouse') ||
      this.isLocationInvalid('rack') ||
      this.isLocationInvalid('row') ||
      this.isLocationInvalid('column')
  }

  //Checks if the stock form is valid
  isStockInvalid(control: any) {
    return this.stockForm.controls[control].invalid &&
            this.stockForm.controls[control].touched;
   }

   //Checks if the stock form is untouched
  isStockUntouched() {
    return this.stockForm.controls.details.pristine ||
            this.stockForm.controls.qty.pristine;
                  
  }

  //Checks if the location form is incompelete
  isStockIncomplete() {
    return this.isStockInvalid('details') ||
      this.isStockInvalid('qty') ||
      this.isStockUntouched(); 
  }

  //Checks if the location form is valid
  isStockEditInvalid(control: any, id: any) {
      return this.getFormControl(id).controls[control].invalid &&
              this.getFormControl(id).controls[control].touched;
  }
  
  //Checks if the location form is incompelete
  isStockEditIncomplete(id: any) {
        return this.isStockEditInvalid('details', id) ||
        this.isStockEditInvalid('qty', id);
        
  }

  

  toggleEdit: boolean = true;
  toggleStockEdit: boolean = true; 
  location : any;  
  stock_list : any = [];
  stock_details : any = [];
 }

