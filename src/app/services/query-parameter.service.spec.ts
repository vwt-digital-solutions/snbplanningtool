import { TestBed } from '@angular/core/testing';

import { QueryParameterService } from './query-parameter.service';

describe('QueryParameterService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: QueryParameterService = TestBed.get(QueryParameterService);
    expect(service).toBeTruthy();
  });
});
