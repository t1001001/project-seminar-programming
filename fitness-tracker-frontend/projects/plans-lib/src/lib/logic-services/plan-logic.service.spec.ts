import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { PlanLogicService } from './plan-logic.service';
import { PlanProviderService } from '../provider-services/plan-provider.service';

describe('PlanLogicService', () => {
  let service: PlanLogicService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PlanProviderService]
    });
    service = TestBed.inject(PlanLogicService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
