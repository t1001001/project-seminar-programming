import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, debounceTime, shareReplay, startWith, switchMap } from 'rxjs';
import { ExerciseLogicService } from '../../logic-services/exercise-logic.service';
import { Exercise } from '../../provider-services/exercise-provider.service';
import { ExerciseCardComponent } from '../../ui/exercise-card/exercise-card';
import { ExerciseDeleteDialogComponent, DeleteDialogData } from '../../ui/exercise-delete-dialog/exercise-delete-dialog';
import { ExerciseFormDialogComponent } from '../../ui/exercise-form-dialog/exercise-form-dialog';

@Component({
  selector: 'ex-exercises-overview',
  imports: [ExerciseCardComponent, MatButtonModule, MatIconModule, ReactiveFormsModule],
  templateUrl: './exercises-overview.html',
  styleUrl: './exercises-overview.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExercisesOverviewComponent {
  private readonly exerciseService = inject(ExerciseLogicService);
  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);

  readonly searchControl = new FormControl('');

  private refreshTrigger$ = new BehaviorSubject<void>(undefined);

  private readonly exercises = toSignal(
    this.refreshTrigger$.pipe(
      switchMap(() => this.exerciseService.getAllExercises()),
      shareReplay(1)
    )
  );

  private readonly searchTerm = toSignal(
    this.searchControl.valueChanges.pipe(startWith(''), debounceTime(300)),
    { initialValue: '' }
  );

  readonly filteredExercises = computed(() => {
    const exercises = this.exercises();
    if (!exercises) return undefined;

    const term = (this.searchTerm() || '').toLowerCase();
    return exercises.filter(exercise =>
      exercise.name.toLowerCase().includes(term) ||
      exercise.category.toLowerCase().includes(term) ||
      exercise.muscleGroups.some(muscle => muscle.toLowerCase().includes(term))
    );
  });

  readonly totalExercisesCount = computed(() => this.exercises()?.length);



  private refreshExercises(): void {
    this.refreshTrigger$.next();
  }

  openCreateDialog(): void {
    const dialogRef = this.dialog.open(ExerciseFormDialogComponent, {
      width: '500px',
      panelClass: 'custom-dialog-container',
    });

    dialogRef.afterClosed().subscribe((result: Omit<Exercise, 'id'> | undefined) => {
      if (result) {
        this.exerciseService.createExercise(result).subscribe({
          next: () => {
            this.refreshExercises();
            this.snackBar.open('Exercise created successfully!', 'Close', {
              duration: 3000,
              horizontalPosition: 'center',
              verticalPosition: 'bottom',
              panelClass: ['success-snackbar']
            });
          },
          error: (err) => {
            this.snackBar.open(err.message, 'Close', {
              duration: 5000,
              horizontalPosition: 'center',
              verticalPosition: 'bottom',
              panelClass: ['error-snackbar']
            });
          }
        });
      }
    });
  }

  onDelete(id: string, name: string): void {
    const dialogRef = this.dialog.open(ExerciseDeleteDialogComponent, {
      width: '400px',
      data: { exerciseName: name } as DeleteDialogData,
      panelClass: 'custom-dialog-container',
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.exerciseService.removeExercise(id).subscribe({
          next: () => {
            this.refreshExercises();
            this.snackBar.open('Exercise deleted successfully!', 'Close', {
              duration: 3000,
              horizontalPosition: 'center',
              verticalPosition: 'bottom',
              panelClass: ['success-snackbar']
            });
          },
          error: (err) => {
            this.snackBar.open(err.message, 'Close', {
              duration: 5000,
              horizontalPosition: 'center',
              verticalPosition: 'bottom',
              panelClass: ['error-snackbar']
            });
          }
        });
      }
    });
  }
}
