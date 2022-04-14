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
  stockForm : any;
  isStock : boolean = false;
  imageType : string = "qrimagestore/";
  randomNum : number = 1; 
  arrayFrom: any; 

  async ngOnInit() {
    this.insight.logPageView("Stock Page Viewed"); 

    this.insight.logEvent("Stock Page Loaded ");

    this.webService.getOneStockDetails(this.route.snapshot.params['id']).subscribe((result : any) => {
      this.details = result
    });

    this.RefreshStock();
    this.RefreshDetails(); 

    this.editForm = this.formBuilder.group({
      name: '',
      desc: '',
      reorder: '',
      img: new File([""], "noimg"),
    });

    this.stockForm = this.formBuilder.group({
      details: '',
      qty: ''
    });
  }

arrayForm = this.formBuilder.group({
    stock: this.formBuilder.array([])
})

  

  DownloadQR(id : any){
    window.open('https://projectqrstore.blob.core.windows.net/qrimagestore/' + id + '.png')
  }

  onToggleEdit(){
    if(this.toggleEdit){
      this.toggleEdit = false
    }
    else{
      this.toggleEdit = true
    }
  }

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

  OnStockSubmit(){
    this.webService.postStock(this.stockForm.value, this.route.snapshot.params['id'])
    .subscribe((respones: any ) => {
      
      this.webService.getOneStockLocation(this.route.snapshot.params['id']).subscribe((result : any) => {
        this.RefreshStock();
      });
    });
  }

  OnDeleteDetails(){
    this.webService.deleteDetails(this.route.snapshot.params['id']).subscribe(() => {
      this.router.navigateByUrl("/stockdetails");
    }); 
  }

  OnDeleteStock(lid:any, sid: any){
    this.webService.deleteStock(lid, sid).subscribe(() => {
      this.RefreshStock();
    }); 
  }

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
              details: stock["details"],
              qty: stock['quantity']
            });
            this.stockEdit.push(stockEditForm);
          }); 
          
      }
      else{
        this.isStock = false;
      }
    });
  }

  RefreshDetails(){
    this.webService.getStockDetails().subscribe((result : any) => {
      this.stock_details = result; 
      });
  }

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

  getCorrectAltText(desc : any){
    if(this.imageType == "qrimagestore/"){
      return "A QR code for the assosiated stock details entry";
    }
    else{
      return desc; 
    }
  }

  get stockEdit() {
    return this.arrayForm.controls["stock"] as FormArray;
  }

  addStockForm() {
    const stockEditForm = this.formBuilder.group({
        quantity: ['']
    });
  
    this.stockEdit.push(stockEditForm);
  }

  getFormControl(id: any){
    return this.stockEdit.at(id) as FormGroup; 
  }

  onToggleStockEdit(){
    if(this.toggleStockEdit){
      this.toggleStockEdit = false 
    }
    else{
      this.toggleStockEdit = true
    }
  }

  OnEditStockSubmit(lid: any, sid: any, id: any){
    this.webService.updateStock(this.getFormControl(id).value, lid, sid)
    .subscribe((respones: any ) => {
        this.RefreshStock();
    });
    
  }

  ClearFormArray(array: FormArray){
    while (array.length != 0) {
      array.removeAt(0)
    }
  }
  

  toggleEdit: boolean = true;
  toggleStockEdit: boolean = true; 
  details : any;  
  stock_list : any = [];
  stock_details : any = [];
  
 }

 