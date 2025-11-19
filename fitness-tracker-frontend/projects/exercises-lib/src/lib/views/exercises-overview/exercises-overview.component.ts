import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { ExerciseLogicService } from '../../logic-services/exercise-logic.service';
import { Exercise } from '../../provider-services/exercise-provider.service';
import { ExerciseCardComponent } from '../../ui/exercise-card/exercise-card.component';
import { ExerciseDeleteDialogComponent, DeleteDialogData } from '../../ui/exercise-delete-dialog/exercise-delete-dialog.component';
import { ExerciseFormDialogComponent } from '../../ui/exercise-form-dialog/exercise-form-dialog.component';

@Component({
  selector: 'ex-exercises-overview',
  imports: [AsyncPipe, ExerciseCardComponent, MatButtonModule],
  templateUrl: './exercises-overview.component.html',
  styleUrl: './exercises-overview.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExercisesOverviewComponent implements OnInit {
  private readonly exerciseService = inject(ExerciseLogicService);
  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);

  readonly exercises$: Observable<Exercise[]> = this.exerciseService.getExercises();

  ngOnInit(): void {
    this.exerciseService.loadExercises().subscribe({
      error: (err) => console.error('Error loading exercises:', err)
    });
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
            this.snackBar.open('Exercise created successfully!', 'Close', {
              duration: 3000,
              horizontalPosition: 'center',
              verticalPosition: 'bottom',
            });
          },
          error: (err) => {
            console.error('Error creating exercise:', err);
            let errorMessage = 'Failed to create exercise';
            
            if (err.status === 409) {
              // Conflict - Name already exists
              errorMessage = err.error || 'Exercise with this name already exists';
            } else if (err.status === 400) {
              // Bad Request - Validation error
              errorMessage = 'Invalid exercise data. Please check all required fields.';
            } else if (err.status === 0) {
              // Network error
              errorMessage = 'Cannot connect to server. Please check your connection.';
            }
            
            this.snackBar.open(errorMessage, 'Close', {
              duration: 5000,
              horizontalPosition: 'center',
              verticalPosition: 'bottom',
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
            this.snackBar.open('Exercise deleted successfully!', 'Close', {
              duration: 3000,
              horizontalPosition: 'center',
              verticalPosition: 'bottom',
            });
          },
          error: (err) => {
            console.error('Error deleting exercise:', err);
            let errorMessage = 'Failed to delete exercise';
            
            if (err.status === 404) {
              // Not Found
              errorMessage = 'Exercise not found. It may have been already deleted.';
            } else if (err.status === 0) {
              // Network error
              errorMessage = 'Cannot connect to server. Please check your connection.';
            }
            
            this.snackBar.open(errorMessage, 'Close', {
              duration: 5000,
              horizontalPosition: 'center',
              verticalPosition: 'bottom',
            });
          }
        });
      }
    });
  }
}
