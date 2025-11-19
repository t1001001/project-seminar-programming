import { TestBed } from '@angular/core/testing';

import { PlanProviderService } from './plan-provider.service';

describe('PlanProviderService', () => {
  let service: PlanProviderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PlanProviderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
