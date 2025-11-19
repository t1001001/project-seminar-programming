import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ExerciseDeleteDialogComponent } from './exercise-delete-dialog.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

describe('ExerciseDeleteDialogComponent', () => {
  let component: ExerciseDeleteDialogComponent;
  let fixture: ComponentFixture<ExerciseDeleteDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExerciseDeleteDialogComponent],
      providers: [
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: { exerciseName: 'Test' } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ExerciseDeleteDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
