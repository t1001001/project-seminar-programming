import { TestBed } from '@angular/core/testing';

import { HomeProviderService } from './home-provider.service';

describe('HomeProviderService', () => {
  let service: HomeProviderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HomeProviderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
