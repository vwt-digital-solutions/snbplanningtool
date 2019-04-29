import { TestBed } from '@angular/core/testing';
import { HttpClientModule, HttpClient } from '@angular/common/http';

import { CarsInfoService } from './cars-info.service';
import { EnvServiceProvider } from './env.service.provider';
import { OAuthService, OAuthLogger, UrlHelperService } from 'angular-oauth2-oidc';

describe('CarsInfoService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    declarations: [

    ],
    imports: [
      HttpClientModule
    ],
    providers: [
      HttpClient,
      EnvServiceProvider,
      UrlHelperService,
      OAuthLogger,
      OAuthService
    ]
  }));

  it('should be created', () => {
    const service: CarsInfoService = TestBed.get(CarsInfoService);
    expect(service).toBeTruthy();
  });
});
