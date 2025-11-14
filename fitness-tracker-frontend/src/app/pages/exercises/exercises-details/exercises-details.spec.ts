import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExercisesDetails } from './exercises-details';

describe('ExercisesDetails', () => {
  let component: ExercisesDetails;
  let fixture: ComponentFixture<ExercisesDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExercisesDetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExercisesDetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
