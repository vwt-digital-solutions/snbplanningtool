import { Component, EventEmitter, Input, Output } from '@angular/core';

import { OAuthService } from 'angular-oauth2-oidc';
import { AuthRoleService } from 'src/app/services/auth-role.service';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  @Input() showSidebar;
  @Output() sidebarButtonClicked: EventEmitter<boolean> = new EventEmitter();

  title = 'Planning tool';

  constructor(
    private oauthService: OAuthService,
    public router: Router,
    public authRoleService: AuthRoleService
  ) {
    // Hide sidebar on /planning
    this.router.events
      .pipe(filter((event: any) => event instanceof NavigationEnd))
      .subscribe(event => {
        if (event.url === '/planning') {
          this.sidebarButtonClicked.emit(false);
        }
      });
  }

  toggleSideBar() {
    this.sidebarButtonClicked.emit(!this.showSidebar);
  }

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
