import { Component } from '@angular/core';
import localeNl from '@angular/common/locales/nl';
import { Loader } from 'google-maps';

import { OAuthService } from 'angular-oauth2-oidc';
import { EnvService } from './services/env.service';
import { AuthRoleService } from './services/auth-role.service';

import { LicenseManager } from 'ag-grid-enterprise';

import { registerLocaleData } from '@angular/common';
import { MapService } from './services/map.service';
import { QueryParameterService } from './services/query-parameter.service';
import { ApiService } from './services/api.service';

registerLocaleData(localeNl);

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  constructor(
    private env: EnvService,
    private api: ApiService,
    private oauthService: OAuthService,
    private queryParamService: QueryParameterService,
    public authRoleService: AuthRoleService,
    public mapService: MapService,
  ) {
    // Save our URL so we can restore it after AD login
    if (!window.location.href.includes('access_token') && window.location.href.includes('localhost')) {
      sessionStorage.setItem('url', window.location.href);
    }

    this.loadGoogleMaps();
    LicenseManager.setLicenseKey(env.agGridKey);

    this.oauthService.configure({
      loginUrl: this.env.loginUrl,
      logoutUrl: this.env.logoutUrl,
      redirectUri: window.location.origin + '/index.html',
      clientId: this.env.clientId,
      scope: this.env.scope,
      issuer: this.env.issuer,
      silentRefreshRedirectUri: window.location.origin + '/silent-refresh.html',
      strictDiscoveryDocumentValidation: false,
    });

    this.oauthService.loadDiscoveryDocument(this.env.discoveryUrl)
      .then(doc => {
        this.oauthService.setupAutomaticSilentRefresh();
        this.oauthService.tryLogin({});
      });

    // Load our saved URL
    const savedURL = sessionStorage.getItem('url');
    if (savedURL && savedURL.includes('?')) {
      const queryParams = this.queryParamService.getRouteParams(sessionStorage.getItem('url'));
      this.queryParamService.setRouteParams(queryParams);
    }
  }

  showFilters = true;

  showSidebar(shown: boolean): void {
    this.showFilters = shown;
    this.mapService.mapResized.next();
  }

  loadGoogleMaps(): void {
    this.api.getMapConfig().subscribe(async (key) => {
      const loader = new Loader(key);
      const google = await loader.load();
      this.mapService.mapConfigComplete.next(true);
    });
  }
}
