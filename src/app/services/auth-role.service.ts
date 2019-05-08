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
    var isAuthorized: boolean = false;

    if (!claims || !claims['roles']) { return null; }

    for (let i = 0; i < claims['roles'].length; i++) {
      if(claims['roles'][i] === Role.Planner || claims['roles'][i] === Role.Editor){
        isAuthorized = true;
      }
    }

    return isAuthorized;
  }

  get isEditor() {
    const claims = this.oauthService.getIdentityClaims();
    var isAuthorized: boolean = false;

    if (!claims || !claims['roles']) { return null; }

    for (let i = 0; i < claims['roles'].length; i++) {
      if(claims['roles'][i] === Role.Editor){
        isAuthorized = true;
      }
    }

    return isAuthorized;
  }

  get isPlanner() {
    const claims = this.oauthService.getIdentityClaims();
    var isAuthorized: boolean = false;

    if (!claims || !claims['roles']) { return null; }

    for (let i = 0; i < claims['roles'].length; i++) {
      if(claims['roles'][i] === Role.Planner){
        isAuthorized = true;
      }
    }

    return isAuthorized;
  }
}
