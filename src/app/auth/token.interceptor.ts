import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

import { OAuthService } from 'angular-oauth2-oidc';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(public oauthService: OAuthService) {}
  /* eslint-disable-next-line  @typescript-eslint/no-explicit-any */
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    request = request.clone({
      setHeaders: {
        Authorization: `Bearer ${this.oauthService.getAccessToken()}`
      }
    });
    return next.handle(request);
  }
}
