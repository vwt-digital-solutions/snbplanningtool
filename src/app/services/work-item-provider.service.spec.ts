import { TestBed } from '@angular/core/testing';

import { WorkItemProviderService } from './work-item-provider.service';

describe('WorkItemProviderService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: WorkItemProviderService = TestBed.get(WorkItemProviderService);
    expect(service).toBeTruthy();
  });
});
