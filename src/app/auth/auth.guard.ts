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
    if(route.data.roles && claims['roles']) {
      var isAuthorisedRoute: boolean = false;
      for (let i = 0; i < claims['roles'].length; i++) {
        if(route.data.roles.indexOf(claims['roles'][i]) > 0){
          isAuthorisedRoute = true;
        }
      }

      if(!isAuthorisedRoute){
        this.router.navigate(['/']);
        return false;
      }
    }
    return true;
  }
}
