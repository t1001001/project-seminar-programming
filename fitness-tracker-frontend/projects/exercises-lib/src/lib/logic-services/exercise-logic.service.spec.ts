import { TestBed } from '@angular/core/testing';

import { ExerciseLogicService } from './exercise-logic.service';

describe('ExerciseLogicService', () => {
  let service: ExerciseLogicService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExerciseLogicService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
