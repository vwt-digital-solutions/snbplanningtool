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

  get isAuthorized() {
    const claims = this.oauthService.getIdentityClaims();
    if (!claims || !claims['roles']) {
      return null;
    }
    return claims && claims['roles'][0] === Role.Planner || claims['roles'][0] === Role.Editor;
  }

  get isEditor() {
    const claims = this.oauthService.getIdentityClaims();
    if (!claims || !claims['roles']) {
      return null;
    }
    return claims && claims['roles'][0] === Role.Editor;
  }

  get isPlanner() {
    const claims = this.oauthService.getIdentityClaims();
    if (!claims || !claims['roles']) {
      return null;
    }
    return claims && claims['roles'][0] === Role.Planner;
  }
}
