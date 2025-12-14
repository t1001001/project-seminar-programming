import { TestBed } from '@angular/core/testing';
import { WorkoutLogicService } from './workout-logic.service';

describe('WorkoutLogicService', () => {
  let service: WorkoutLogicService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WorkoutLogicService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

