import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WorkoutStartDialogComponent } from './workout-start-dialog';

describe('WorkoutStartDialogComponent', () => {
  let component: WorkoutStartDialogComponent;
  let fixture: ComponentFixture<WorkoutStartDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkoutStartDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(WorkoutStartDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
