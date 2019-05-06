import { Component } from '@angular/core';

import { OAuthService, AuthConfig } from 'angular-oauth2-oidc';
import { EnvService } from './services/env.service';

import { LicenseManager } from 'ag-grid-enterprise';

import { registerLocaleData } from '@angular/common';
import localeNl from '@angular/common/locales/nl';

registerLocaleData(localeNl);

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  constructor(
    private env: EnvService,
    private oauthService: OAuthService
  ) {
    LicenseManager.setLicenseKey(env.agGridKey);

    const config = new AuthConfig();
    config.loginUrl = env.loginUrl;
    config.redirectUri = window.location.origin + "/index.html";
    config.logoutUrl = env.logoutUrl;
    config.clientId = env.clientId;
    config.scope = env.scope;
    config.issuer = env.issuer;
    config.silentRefreshRedirectUri = window.location.origin + '/silent-refresh.html';

    this.oauthService.configure(config);
    this.oauthService.setupAutomaticSilentRefresh();
    this.oauthService.tryLogin({});

  }

  get authenticationToken() {
    if (this.oauthService.hasValidIdToken()) {
      return true;
    }
    return false;
  }
}
