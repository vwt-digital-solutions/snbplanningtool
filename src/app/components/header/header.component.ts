import { Component } from '@angular/core';

import { OAuthService } from 'angular-oauth2-oidc';
import { AuthRoleService } from 'src/app/services/auth-role.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  title = 'Planning tool';

  constructor(
    private oauthService: OAuthService,
    public authRoleService: AuthRoleService
  ) {}

  logout() {
    this.oauthService.logOut();
  }

  get email() {
    const claims = this.oauthService.getIdentityClaims();
    if (!claims) {
      return null;
    }
    return claims['email'];
  }
  get roles() {
    const claims = this.oauthService.getIdentityClaims();
    var allRoles = [];

    if (!claims || !claims['roles']) { return null; }

    for (let i = 0; i < claims['roles'].length; i++) {
        allRoles.push(claims['roles'][i].replace(/^[^.]+./g, ''));
    }
    allRoles.sort();

    return allRoles.join(', ');
  }
}
