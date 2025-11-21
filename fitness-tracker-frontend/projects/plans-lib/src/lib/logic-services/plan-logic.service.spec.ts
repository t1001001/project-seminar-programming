import { TestBed } from '@angular/core/testing';

import { PlanLogicService } from './plan-logic.service';

describe('PlanLogicService', () => {
  let service: PlanLogicService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PlanLogicService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
