import { Location } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { ExerciseLogicService } from '../../logic-services/exercise-logic.service';
import { Exercise, ExerciseCategory } from '../../provider-services/exercise-provider.service';
import { showError, showSuccess } from '../../shared';

import { AuthService } from 'common-lib';

@Component({
  selector: 'ex-exercise-detail',
  imports: [
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatSnackBarModule,
    ReactiveFormsModule,
  ],
  templateUrl: './exercise-detail.html',
  styleUrl: './exercise-detail.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class ExerciseDetailComponent implements OnInit {
  private readonly location = inject(Location);
  private readonly route = inject(ActivatedRoute);
  private readonly exerciseService = inject(ExerciseLogicService);
  private readonly fb = inject(FormBuilder);
  private readonly snackBar = inject(MatSnackBar);
  private readonly cdr = inject(ChangeDetectorRef);
  public readonly authService = inject(AuthService);

  private exerciseId: string | null = null;
  exercise: Exercise | null = null;

  isEditMode = false;

  readonly form: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    category: [ExerciseCategory.Unspecified, [Validators.required]],
    description: [''],
    muscleGroups: ['', [Validators.required]],
  });

  readonly categories = Object.values(ExerciseCategory);

  ngOnInit(): void {
    this.exerciseId = this.route.snapshot.paramMap.get('id');
    if (this.exerciseId) {
      this.loadExercise(this.exerciseId);
    }
  }

  private loadExercise(id: string): void {
    this.exerciseService.getExerciseById(id).subscribe({
      next: (exercise) => {
        this.exercise = exercise;
        this.form.patchValue({
          name: exercise.name,
          category: exercise.category,
          description: exercise.description || '',
          muscleGroups: exercise.muscleGroups.join(', '),
        });
        this.cdr.markForCheck();
      },
      error: (err) => showError(this.snackBar, err.message)
    });
  }

  onUpdate(): void {
    if (this.form.valid && this.form.dirty && this.exerciseId) {
      const formValue = this.form.value;
      const muscleGroupsArray = formValue.muscleGroups
        ? formValue.muscleGroups.split(',').map((group: string) => group.trim()).filter((g: string) => g.length > 0)
        : [];

      const exerciseData = {
        name: formValue.name || '',
        category: formValue.category as ExerciseCategory,
        description: formValue.description || '',
        muscleGroups: muscleGroupsArray.length > 0 ? muscleGroupsArray : ['General'],
      };
      this.exerciseService.updateExercise(this.exerciseId, exerciseData).subscribe({
        next: (updatedExercise) => {
          this.exercise = updatedExercise;
          this.isEditMode = false;
          this.form.markAsPristine();
          this.form.patchValue({
            name: updatedExercise.name,
            category: updatedExercise.category,
            description: updatedExercise.description || '',
            muscleGroups: updatedExercise.muscleGroups.join(', '),
          });
          this.cdr.markForCheck();
          showSuccess(this.snackBar, 'Exercise updated successfully!');
        },
        error: (err) => showError(this.snackBar, err.message)
      });
    }
  }

  goBack(): void {
    this.location.back();
  }

  enableEditMode(): void {
    this.isEditMode = true;
  }

  cancelEdit(): void {
    this.isEditMode = false;
    if (this.exerciseId) {
      this.loadExercise(this.exerciseId);
    }
    this.form.markAsPristine();
  }

  saveChanges(): void {
    this.onUpdate();
  }
}
