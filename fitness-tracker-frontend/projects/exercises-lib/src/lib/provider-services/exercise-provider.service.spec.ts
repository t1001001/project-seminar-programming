import { TestBed } from '@angular/core/testing';

import { ExerciseProviderService } from './exercise-provider.service';

describe('ExerciseProviderService', () => {
  let service: ExerciseProviderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExerciseProviderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
