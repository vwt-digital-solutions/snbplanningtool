import { TestBed } from '@angular/core/testing';
import { HttpClient, HttpHandler } from '@angular/common/http';

import { OAuthModule, OAuthService } from 'angular-oauth2-oidc';

import { AuthRoleService } from './auth-role.service';

describe('AuthRoleService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      OAuthModule.forRoot()
    ],
    providers: [
      OAuthService,
      HttpClient,
      HttpHandler
    ],
  }));

  it('should be created', () => {
    const service: AuthRoleService = TestBed.get(AuthRoleService);
    expect(service).toBeTruthy();
  });
});
