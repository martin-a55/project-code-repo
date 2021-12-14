import { Component } from '@angular/core';
import { WebService } from './web.service';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '@auth0/auth0-angular';


@Component({
 selector: 'location',
 templateUrl: './location.component.html',
 styleUrls: ['./location.component.css']
})

export class LocationComponent {
  constructor(public webService: WebService, private formBuilder: FormBuilder, public authService: AuthService) {}
  page : number = 1

  async ngOnInit() {
    this.webService.getStockLoactions().subscribe((result : any) => {
      this.location_list = result; 
      
    });
  }

  DownloadQR(id : any){
    window.open('https://projectqrstore.blob.core.windows.net/qrimagestore/' + id + '.png')
  }

 



  
  location_list : any = [];  
 }

