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
      .pipe(filter((event: NavigationEnd) => event instanceof NavigationEnd))
      .subscribe(event => {
        if (['/planning', '/monteurs'].includes(event.url)) {
          this.sidebarButtonClicked.emit(false);
        }
      });
  }

  toggleSideBar(): void {
    this.sidebarButtonClicked.emit(!this.showSidebar);
  }

  logout(): void {
    this.oauthService.logOut();
  }

  get email(): string {
    /* eslint-disable  @typescript-eslint/no-explicit-any */
    const claims: any = this.oauthService.getIdentityClaims();
    if (!claims) {
      return null;
    }
    return claims._email;
  }
  get roles(): string {
    /* eslint-disable  @typescript-eslint/no-explicit-any */
    const claims: any = this.oauthService.getIdentityClaims();
    const allRoles = [];

    if (!claims || !claims._roles) { return null; }

    for (const value of claims._roles) {
        allRoles.push(value.replace(/^[^.]+./g, ''));
    }
    allRoles.sort();

    return allRoles.join(', ');
  }
}
