import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExercisesDashboardComponent } from './exercises-dashboard.component';

describe('ExercisesDashboardComponent', () => {
  let component: ExercisesDashboardComponent;
  let fixture: ComponentFixture<ExercisesDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExercisesDashboardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ExercisesDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
