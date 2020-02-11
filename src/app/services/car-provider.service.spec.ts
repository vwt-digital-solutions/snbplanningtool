import { TestBed } from '@angular/core/testing';

import { CarProviderService } from './car-provider.service';

describe('CarProviderService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CarProviderService = TestBed.get(CarProviderService);
    expect(service).toBeTruthy();
  });
});
