import { Component } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';

@Component( {
 selector: 'navigation',
 templateUrl: './nav.component.html',
 styleUrls: []
})
export class NavComponent {
 constructor(public authService: AuthService, public router: Router, private formBuilder: FormBuilder) {}

 searchForm: any;

 async ngOnInit() {
     

     this.searchForm = this.formBuilder.group({
       value: ['', Validators.required],
       field: [''],
       col: ['']
       });
       this.searchForm.controls['field'].setValue('all')
       this.searchForm.controls['col'].setValue('location')
   }
   
   onSearchSubmit(){
        
        this.router.navigate(
            ['/search'],
            { queryParams: { field: this.searchForm.value.field , value: this.searchForm.value.value, col: this.searchForm.value.col} } 
        );
        this.searchForm.controls.value.reset(); 
   }
}
