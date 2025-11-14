import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExercisesOverview } from './exercises-overview';

describe('ExercisesOverview', () => {
  let component: ExercisesOverview;
  let fixture: ComponentFixture<ExercisesOverview>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExercisesOverview]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExercisesOverview);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
