import { TestBed } from '@angular/core/testing';
import { WorkoutProviderService } from './workout-provider.service';

describe('WorkoutProviderService', () => {
  let service: WorkoutProviderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WorkoutProviderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

