import {Component, EventEmitter, Input, Output} from '@angular/core';

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

  @Input() showSidebar: boolean;
  @Output() onSidebarButtonClicked: EventEmitter<any> = new EventEmitter();

  logout() {
    this.oauthService.logOut();
  }

  get email() {
    const claims = this.oauthService.getIdentityClaims();
    if (!claims) {
      return null;
    }
    return (claims as any)._email;
  }
  get roles() {
    const claims = this.oauthService.getIdentityClaims();
    const allRoles = [];

    if (!claims || !(claims as any)._roles) { return null; }

    for (const value of (claims as any)._roles) {
        allRoles.push(value.replace(/^[^.]+./g, ''));
    }
    allRoles.sort();

    return allRoles.join(', ');
  }
}
