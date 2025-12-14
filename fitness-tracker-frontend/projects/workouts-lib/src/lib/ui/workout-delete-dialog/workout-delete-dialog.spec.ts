import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WorkoutDeleteDialogComponent } from './workout-delete-dialog';

describe('WorkoutDeleteDialogComponent', () => {
  let component: WorkoutDeleteDialogComponent;
  let fixture: ComponentFixture<WorkoutDeleteDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkoutDeleteDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(WorkoutDeleteDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});


