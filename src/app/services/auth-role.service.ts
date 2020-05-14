import { Injectable } from '@angular/core';

import { OAuthService } from 'angular-oauth2-oidc';

import { Role } from '../models/role';

@Injectable({
  providedIn: 'root'
})
export class AuthRoleService {

  constructor(
    private oauthService: OAuthService
  ) { }

  get hasValidAccessToken(): boolean {
    if (this.oauthService.hasValidAccessToken()) {
      return true;
    }
    return false;
  }

  get isAuthorized(): boolean {
    /* eslint-disable-next-line  @typescript-eslint/no-explicit-any */
    const claims: any = this.oauthService.getIdentityClaims();
    let isAuthorized = false;

    if (!claims || !claims.roles) { return null; }

    for (const value of claims.roles) {
      if (value === Role.Planner || value === Role.Editor) {
        isAuthorized = true;
      }
    }

    return isAuthorized;
  }

  get isEditor(): boolean {
    /* eslint-disable-next-line  @typescript-eslint/no-explicit-any */
    const claims: any = this.oauthService.getIdentityClaims();
    let isAuthorized = false;

    if (!claims || !claims.roles) { return null; }

    for (const value of claims.roles) {
      if (value === Role.Editor) {
        isAuthorized = true;
      }
    }

    return isAuthorized;
  }

  get isPlanner(): boolean {
    /* eslint-disable-next-line  @typescript-eslint/no-explicit-any */
    const claims: any = this.oauthService.getIdentityClaims();
    let isAuthorized = false;

    if (!claims || !claims.roles) { return null; }

    for (const value of claims.roles) {
      if (value === Role.Planner) {
        isAuthorized = true;
      }
    }

    return isAuthorized;
  }
}
