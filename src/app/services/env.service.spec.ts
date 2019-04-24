import { TestBed } from '@angular/core/testing';

import { EnvService } from './env.service';
import { EnvServiceProvider } from './env.service.provider';

describe('EnvService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        EnvServiceProvider
      ]
    });
  });

  it('should be created', () => {
    const service: EnvService = TestBed.get(EnvService);
    expect(service).toBeTruthy();
  });

  it('should define all variables', () => {
    const service: EnvService = TestBed.get(EnvService);

    expect(service.apiUrl).toBeDefined();
    expect(service.clientId).toBeDefined();
    expect(service.enableDebug).toBeDefined();
    expect(service.googleMapsKey).toBeDefined();
    expect(service.issuer).toBeDefined();
    expect(service.loginUrl).toBeDefined();
    expect(service.scope).toBeDefined();
  });
});
