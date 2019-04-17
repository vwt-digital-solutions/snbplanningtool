import { Component } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  title = 'Planning tool';
  username: string = 'd.vanrhenen@vwtelecom.com';

  constructor(
    private oauthService: OAuthService
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
}
