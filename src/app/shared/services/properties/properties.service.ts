import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import * as GlobalEnvironment from '../../../../environments/environment';

import { Properties } from './properties.model';

@Injectable({
  providedIn: 'root',
})
export class PropertiesService {
  public props: Properties;

  private propsFake: Properties = {
    appName: 'portal-videoconsulta-dental-ng',
    version: '1.0.0-dev',
  };

  constructor(private http: HttpClient) {}

  loadProps(): Promise<any> {
    if (GlobalEnvironment.environment.production) {
      const promise = this.http.get('package.json').toPromise();
      promise.then((res) => {
        const resFormatted = JSON.parse(res.toString());
        this.props = {
          appName: resFormatted.name,
          version: resFormatted.version
        };
      });

      return promise;
    }

    const localPromise = new Promise((resolve) => {
      this.props = this.propsFake;
      resolve();
    });

    return localPromise;
  }
}
