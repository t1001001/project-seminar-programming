import { Location } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { Exercise } from '../../domain/models/exercise.model';
import { ExerciseService } from '../../services/business/exercise.service';
import { ExerciseProvider } from '../../services/providers/exercise.provider';

@Component({
  selector: 'ex-exercise-detail',
  imports: [
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
    ReactiveFormsModule,
  ],
  templateUrl: './exercise-detail.component.html',
  styleUrl: './exercise-detail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExerciseDetailComponent implements OnInit {
  private readonly location = inject(Location);
  private readonly route = inject(ActivatedRoute);
  private readonly exerciseService = inject(ExerciseService);
  private readonly exerciseProvider = inject(ExerciseProvider);
  private readonly fb = inject(FormBuilder);
  private readonly snackBar = inject(MatSnackBar);

  private exerciseId: string | null = null;

  readonly form: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    category: [''],
    description: [''],
    muscleGroups: [''],
  });

  ngOnInit(): void {
    this.exerciseId = this.route.snapshot.paramMap.get('id');
    if (this.exerciseId) {
      this.loadExercise(this.exerciseId);
    }
  }

  private loadExercise(id: string): void {
    this.exerciseProvider.getExercises().subscribe(exercises => {
      const exercise = exercises.find(ex => ex.id === id);
      if (exercise) {
        this.form.patchValue({
          name: exercise.name,
          category: exercise.category,
          description: exercise.description || '',
          muscleGroups: exercise.muscleGroups.join(', '),
        });
      }
    });
  }

  onUpdate(): void {
    if (this.form.valid && this.form.dirty && this.exerciseId) {
      const formValue = this.form.value;
      const exercise: Exercise = {
        id: this.exerciseId,
        name: formValue.name,
        category: formValue.category,
        description: formValue.description,
        muscleGroups: formValue.muscleGroups
          ? formValue.muscleGroups.split(',').map((group: string) => group.trim())
          : [],
      };
      this.exerciseService.updateExercise(exercise);
      this.form.markAsPristine();
      this.snackBar.open('Exercise updated successfully!', 'Close', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
      });
    }
  }

  goBack(): void {
    this.location.back();
  }
}
