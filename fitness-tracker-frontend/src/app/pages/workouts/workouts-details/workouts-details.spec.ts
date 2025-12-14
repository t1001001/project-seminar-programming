import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkoutsDetails } from './workouts-details';

describe('WorkoutsDetails', () => {
  let component: WorkoutsDetails;
  let fixture: ComponentFixture<WorkoutsDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkoutsDetails],
    }).compileComponents();

    fixture = TestBed.createComponent(WorkoutsDetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});




