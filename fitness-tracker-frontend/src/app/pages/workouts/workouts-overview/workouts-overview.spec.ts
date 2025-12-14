import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkoutsOverview } from './workouts-overview';

describe('WorkoutsOverview', () => {
  let component: WorkoutsOverview;
  let fixture: ComponentFixture<WorkoutsOverview>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkoutsOverview],
    }).compileComponents();

    fixture = TestBed.createComponent(WorkoutsOverview);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});




