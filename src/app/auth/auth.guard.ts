import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate, Router } from '@angular/router';

import { OAuthService } from 'angular-oauth2-oidc';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private oauthService: OAuthService,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    this.oauthService.tryLogin()
      .catch(err => {
        console.error(err);
      })
      .then(() => {
        if(!this.oauthService.hasValidAccessToken()) {
          this.oauthService.initImplicitFlow()
        }
      });

    const claims = this.oauthService.getIdentityClaims();
    if(route.data.roles && route.data.roles.indexOf(claims['roles'][0]) === -1) {
      this.router.navigate(['/']);
      return false;
    }
    return true;
  }
}
