import { Component } from '@angular/core';
import { WebService } from './web.service';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '@auth0/auth0-angular';
import { ActivatedRoute, Router} from '@angular/router';


@Component({
 selector: 'stock',
 templateUrl: './stock.component.html',
 styleUrls: ['./stock.component.css']
})

export class StockComponent {
  
  constructor(public webService: WebService, private formBuilder: FormBuilder, public authService: AuthService, private route: ActivatedRoute, private router : Router) {}

  page : number = 1
  editForm: any;
  stockForm : any;
  isStock : boolean = false

  async ngOnInit() {
    this.webService.getOneStockLocation(this.route.snapshot.params['id']).subscribe((result : any) => {
      this.location = result
    });

    this.RefreshStock();

    this.editForm = this.formBuilder.group({
      location: '',
      warehouse: '',
      rack: '',
      row: '',
      column: ''
    });

    this.stockForm = this.formBuilder.group({
      name: '',
      qty: '',
      desc: '',
    });
  }

  

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
    this.webService.updateLocation(this.editForm.value, this.route.snapshot.params['id'])
    .subscribe((respones: any ) => {
      
      this.webService.getOneStockLocation(this.route.snapshot.params['id']).subscribe((result : any) => {
        this.location = result
        this.toggleEdit = true
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

  OnDeleteLocation(){
    this.webService.deleteLocation(this.route.snapshot.params['id']).subscribe(() => {
      this.router.navigateByUrl("/location");
    }); 
  }

  OnDeleteStock(sid: any){
    this.webService.deleteStock(this.route.snapshot.params['id'], sid).subscribe(() => {
      this.RefreshStock();
    }); 
  }

  RefreshStock(){
    this.webService.getStock(this.route.snapshot.params['id']).subscribe((result : any) => {
      this.stock_list = result;  
      if(this.stock_list.length != 0){
          this.isStock = true;
      }
      else{
        this.isStock = false;
      }
    });
  }

  

  toggleEdit: boolean = true;
  location : any;  
  stock_list : any = [];
 }

