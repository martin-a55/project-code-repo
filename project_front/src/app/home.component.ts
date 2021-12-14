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

    page : any

    pages : any

    ngOnInit() {
        this.pokedex_list = this.webService.getShortPokedex(this.page);      
        this.OnRandomPokemon();  
    }

    OnRandomPokemon(){
        this.webService.getPages().subscribe((value : any) => { 
            this.pages = Math.floor(((value[0].totalPages -1) * 10) / 3)
            this.page = Math.floor(Math.random() * this.pages) + 1;
            this.pokedex_list = this.webService.getShortPokedex(this.page);
    });
    }
    

    pokedex_list : any = []; 
 }

