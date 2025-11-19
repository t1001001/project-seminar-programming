import { TestBed } from '@angular/core/testing';

import { SessionLogicService } from './session-logic.service';

describe('SessionLogicService', () => {
  let service: SessionLogicService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SessionLogicService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
