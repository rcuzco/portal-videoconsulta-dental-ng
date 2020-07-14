
import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpEventType,
  HttpResponse,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { tap } from 'rxjs/operators';

import { TokenService } from './../token/token.service';
import { PropertiesService } from '../properties/properties.service';

@Injectable({
  providedIn: 'root'
})
export class RestInterceptor implements HttpInterceptor {

  private customConfig;
  constructor(private token: TokenService, private properties: PropertiesService) {
  }

  intercept(req: HttpRequest<{}>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!this.customConfig) {
      this.customConfig = this.getCustomConfig();
    }

    let authReq;

    if (this.token.getToken()) {
      authReq = req.clone({
        setHeaders: {
          Authorization: `${this.token.getToken()}`,
          ...this.customConfig
        }
      });
    } else {
      authReq = req.clone({
        setHeaders: { ...this.customConfig }
      });
    }

    return next.handle(authReq).pipe(tap((event: HttpEvent<{}>) => {
      if (event instanceof HttpResponse) {
        // do stuff with response if you want
      }
    }, (err: any) => {
      if (err instanceof HttpErrorResponse) {
        return throwError(err);
      }
    }));
  }

  private getCustomConfig() {
    if (!this.properties.props){
      return;
    }
    const config = {
      'snt-caller-id': this.properties.props.appName,
      'snt-caller-version': this.properties.props.version
    };

    return config;
  }

}
