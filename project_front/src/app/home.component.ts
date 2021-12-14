import { Component } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { WebService } from './web.service';

@Component({
 selector: 'home',
 templateUrl: './home.component.html',
 styleUrls: ['./home.component.css']
})

export class HomeComponent {
    constructor(public authService: AuthService, public webService: WebService) {}

    ngOnInit() {
        
    }
}
    

   

