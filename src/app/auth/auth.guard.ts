import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';

import { OAuthService } from 'angular-oauth2-oidc';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private oauthService: OAuthService,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    this.oauthService.tryLogin()
      .then(() => {
        if (!this.oauthService.hasValidAccessToken()) {
          this.oauthService.initImplicitFlow();
        }
      });

    /* eslint-disable-next-line  @typescript-eslint/no-explicit-any */
    const claims: any = this.oauthService.getIdentityClaims();
    if (route.data.roles && claims._roles) {
      let isAuthorisedRoute = false;
      for (const value of claims._roles) {
        if (route.data.roles.indexOf(value) > -1) {
          isAuthorisedRoute = true;
        }
      }

      if (!isAuthorisedRoute) {
        this.router.navigate(['/']);
        return false;
      }
    }
    return true;
  }
}
