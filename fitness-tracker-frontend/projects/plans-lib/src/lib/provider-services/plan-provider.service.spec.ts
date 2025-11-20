import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { PlanProviderService } from './plan-provider.service';

describe('PlanProviderService', () => {
  let service: PlanProviderService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(PlanProviderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
