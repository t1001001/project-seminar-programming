import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, Observable, switchMap } from 'rxjs';
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

  private refreshTrigger$ = new BehaviorSubject<void>(undefined);
  readonly exercises$: Observable<Exercise[]> = this.refreshTrigger$.pipe(
    switchMap(() => this.exerciseService.getAllExercises())
  );

  ngOnInit(): void {
    // exercises$ will automatically fetch on initialization
  }

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
