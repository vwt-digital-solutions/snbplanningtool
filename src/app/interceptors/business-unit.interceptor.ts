import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EnvService } from '../services/env.service';

@Injectable()
export class BusinessUnitInterceptor implements HttpInterceptor {
  constructor(private env: EnvService) {}
  /* eslint-disable-next-line  @typescript-eslint/no-explicit-any */
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Some other api
    if (!this.apiRequest(request.url)) {
      return next.handle(request);
    }

    // Not one of our specified requests
    if (!this.matchesApiPaths(request.url)) {
      return next.handle(request);
    }


    const businessUnit =  localStorage.getItem('businessUnit');
    if (businessUnit != null && businessUnit !== 'service') {
      // Service should not add a business unit
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
