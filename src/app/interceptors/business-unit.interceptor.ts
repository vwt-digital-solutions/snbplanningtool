import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EnvService } from '../services/env.service';

@Injectable()
export class BusinessUnitInterceptor implements HttpInterceptor {
  constructor(private env: EnvService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!this.apiRequest(request.url)) {
      return next.handle(request);
    }

    if (!this.matchesApiPaths(request.url)) {
      return next.handle(request);
    }

    if (localStorage.getItem('businessUnit') != null) {
      const businessUnit =  localStorage.getItem('businessUnit');

      const customReq = request.clone({
        url: `${request.url}?business_unit=${businessUnit}`
      });

      return next.handle(customReq);
    } else {
      return next.handle(request);
    }
  }

  apiRequest(url: string): boolean {
    return url.includes(this.env.apiUrl);
  }

  matchesApiPaths(url: string): boolean {
    return url.includes('/workitems') || url.includes('/cars');
  }
}
