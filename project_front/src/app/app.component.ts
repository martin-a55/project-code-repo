import {Component, ViewEncapsulation} from '@angular/core';
import { Title } from '@angular/platform-browser';
import { InsightService } from './insight.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent {
  constructor(private insightService: InsightService, private titleService: Title) {}
  title: string = 'Conveyortek Stock Managment';

  async ngOnInit() {
    this.titleService.setTitle(this.title);
  }
  

}
