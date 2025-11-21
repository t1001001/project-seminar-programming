import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExercisesOverviewComponent } from './exercises-overview.component';

describe('ExercisesOverviewComponent', () => {
  let component: ExercisesOverviewComponent;
  let fixture: ComponentFixture<ExercisesOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExercisesOverviewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExercisesOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
