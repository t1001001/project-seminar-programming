import { TestBed } from '@angular/core/testing';

import { SessionProviderService } from './session-provider.service';

describe('SessionProviderService', () => {
  let service: SessionProviderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SessionProviderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
