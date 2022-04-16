import { Component } from '@angular/core';
import { WebService } from './web.service';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '@auth0/auth0-angular';
import { Router, ActivatedRoute } from '@angular/router';


@Component({
 selector: 'search',
 templateUrl: './search.component.html',
 styleUrls: ['./search.component.css']
})

export class SearchComponent {
  constructor(public webService: WebService, private formBuilder: FormBuilder, public authService: AuthService, private route: ActivatedRoute, public router: Router) {}

  searchForm: any;
  searchField : any; 
  searchValue : any;
  searchCol : any;
  page : number = 1;
  isCol: Boolean = true; 
  imageType : string = "qrimagestore/";
  randomNum : number = 1; 
  
  async ngOnInit() {
    
    this.searchForm = this.formBuilder.group({
      value: ['', Validators.required],
      field: [''],
      col: ['']
      });
      
      this.route.queryParams
      .subscribe((respones: any ) => {
        this.searchField = respones.field;
        this.searchValue = respones.value;
        this.searchCol = respones.col; 
        this.searchForm.controls['field'].setValue(respones.field);
        this.searchForm.controls['value'].setValue(respones.value);
        this.searchForm.controls['col'].setValue(respones.col);
        this.webService.getSearch( respones.field, respones.value, respones.col).subscribe((respones: any) => 
          this.search_list = respones
          
        )});
   
  }
  
  onSearchSubmit(){
    this.router.navigate(
      ['/search'],
      { queryParams: { field: this.searchForm.value.field , value: this.searchForm.value.value, col: this.searchForm.value.col} } 
  );
    this.route.queryParams
      .subscribe((respones: any ) => {
      this.search_list = this.webService.getSearch( respones.field, respones.value, respones.col)
      });
       
  }

  DownloadQR(id : any){
    window.open('https://projectqrstore.blob.core.windows.net/qrimagestore/' + id + '.png')
  }

  checkIsCol(colValue: any){
    if(colValue == "location"){
      this.isCol = true; 
    }
    else{
      this.isCol = false; 
    }
    return this.isCol; 
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

  search_list : any = [];  
 }

 

