import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkoutEditDialogComponent } from './workout-edit-dialog';

describe('WorkoutEditDialogComponent', () => {
  let component: WorkoutEditDialogComponent;
  let fixture: ComponentFixture<WorkoutEditDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkoutEditDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(WorkoutEditDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});


