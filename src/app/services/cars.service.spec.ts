import { TestBed } from '@angular/core/testing';
import { HttpClientModule, HttpClient } from '@angular/common/http';

import { CarsService } from './cars.service';
import { EnvServiceProvider } from './env.service.provider';
import { OAuthService, OAuthLogger, UrlHelperService } from 'angular-oauth2-oidc';

describe('CarsService', () => {
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
    const service: CarsService = TestBed.get(CarsService);
    expect(service).toBeTruthy();
  });
});
