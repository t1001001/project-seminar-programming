import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExerciseDeleteDialogComponent } from './exercise-delete-dialog.component';

describe('ExerciseDeleteDialogComponent', () => {
  let component: ExerciseDeleteDialogComponent;
  let fixture: ComponentFixture<ExerciseDeleteDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExerciseDeleteDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExerciseDeleteDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
