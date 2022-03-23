import {Component, ViewEncapsulation} from '@angular/core';
import { InsightService } from './insight.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent {
  constructor(private insightService: InsightService) {
    
  }
  title = 'project_front';
}
