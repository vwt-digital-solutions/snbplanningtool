import { TestBed } from '@angular/core/testing';
import { HttpClientModule, HttpClient } from '@angular/common/http';

import { WorkService } from './work.service';
import { EnvServiceProvider } from './env.service.provider';
import { OAuthService, OAuthLogger, UrlHelperService } from 'angular-oauth2-oidc';

describe('WorkService', () => {
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
    const service: WorkService = TestBed.get(WorkService);
    expect(service).toBeTruthy();
  });
});
