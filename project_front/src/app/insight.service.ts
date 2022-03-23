
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

import { ApplicationInsights } from '@microsoft/applicationinsights-web';

@Injectable()
export class InsightService {
  appInsights: ApplicationInsights;
  constructor() {
    this.appInsights = new ApplicationInsights({
      config: {
        instrumentationKey: environment.appInsight.instrumentationKey,
        enableAutoRouteTracking: true 
      }
    });
    this.appInsights.loadAppInsights();
  }

  logPageView(name?: string, url?: string) { 
    this.appInsights.trackPageView({
      name: name,
      uri: url
    });
  }

  logEvent(name: string, properties?: { [key: string]: any }) {
    this.appInsights.trackEvent({ name: name}, properties);
  }

}
