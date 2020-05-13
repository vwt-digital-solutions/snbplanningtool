import { Component } from '@angular/core';

import { OAuthService, AuthConfig } from 'angular-oauth2-oidc';
import { EnvService } from './services/env.service';
import { AuthRoleService } from './services/auth-role.service';

import { LicenseManager } from 'ag-grid-enterprise';

import { registerLocaleData } from '@angular/common';
import localeNl from '@angular/common/locales/nl';
import {MapService} from './services/map.service';
import { QueryParameterService } from './services/query-parameter.service';

registerLocaleData(localeNl);

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  constructor(
    private env: EnvService,
    private oauthService: OAuthService,
    private queryParamService: QueryParameterService,
    public authRoleService: AuthRoleService,
    public mapService: MapService,
  ) {
    // Save our URL so we can restore it after AD login
    if (!window.location.href.includes('access_token') && window.location.href.includes('localhost')) {
      sessionStorage.setItem('url', window.location.href);
    }

    LicenseManager.setLicenseKey(env.agGridKey);

    const config = new AuthConfig();
    config.loginUrl = env.loginUrl;
    config.redirectUri = window.location.origin + '/index.html';
    config.logoutUrl = env.logoutUrl;
    config.clientId = env.clientId;
    config.scope = env.scope;
    config.issuer = env.issuer;
    config.silentRefreshRedirectUri = window.location.origin + '/silent-refresh.html';

    this.oauthService.configure(config);
    this.oauthService.setupAutomaticSilentRefresh();
    this.oauthService.tryLogin({});

    // Load our saved URL
    const savedURL = sessionStorage.getItem('url');
    if (savedURL && savedURL.includes('?')) {
      const queryParams = this.queryParamService.getRouteParams(sessionStorage.getItem('url'));
      this.queryParamService.setRouteParams(queryParams);
    }
  }

  showFilters = true;

  showSidebar(shown: boolean) {
    this.showFilters = shown;
    this.mapService.mapResized.next();
  }
}
