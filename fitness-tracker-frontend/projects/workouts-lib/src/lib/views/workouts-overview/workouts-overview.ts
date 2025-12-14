import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { AsyncPipe } from '@angular/common';
import { BehaviorSubject, Observable, catchError, of, switchMap } from 'rxjs';

import { WorkoutLogicService } from '../../logic-services/workout-logic.service';
import { WorkoutLog } from '../../provider-services/workout-provider.service';
import { WorkoutCardComponent } from '../../ui/workout-card/workout-card';
import { WorkoutDeleteDialogComponent } from '../../ui/workout-delete-dialog/workout-delete-dialog';
import { WorkoutEditDialogComponent } from '../../ui/workout-edit-dialog/workout-edit-dialog';

const SNACKBAR_SUCCESS_DURATION = 3000;
const SNACKBAR_ERROR_DURATION = 5000;

@Component({
  selector: 'lib-workouts-overview',
  imports: [
    MatDialogModule,
    MatSnackBarModule,
    MatIconModule,
    AsyncPipe,
    WorkoutCardComponent,
  ],
  templateUrl: './workouts-overview.html',
  styleUrl: './workouts-overview.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WorkoutsOverviewComponent implements OnInit {
  private readonly workoutService = inject(WorkoutLogicService);
  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);

  private readonly refreshTrigger$ = new BehaviorSubject<void>(undefined);

  workoutLogs$: Observable<WorkoutLog[]> = this.refreshTrigger$.pipe(
    switchMap(() => this.workoutService.getActiveWorkoutLogs()),
    catchError((err) => {
      this.snackBar.open(err.message, 'Close', {
        duration: SNACKBAR_ERROR_DURATION,
        panelClass: ['error-snackbar']
      });
      return of([]);
    })
  );

  ngOnInit(): void {
    // Subscribe to workout session events to auto-refresh
    this.workoutService.workoutCompleted$.subscribe(() => {
      this.refresh();
    });
    this.workoutService.workoutSaved$.subscribe(() => {
      this.refresh();
    });
  }

  refresh(): void {
    this.refreshTrigger$.next();
  }

  onDelete(logId: string, sessionName: string): void {
    const dialogRef = this.dialog.open(WorkoutDeleteDialogComponent, {
      width: '400px',
      panelClass: 'custom-dialog-container',
      data: { sessionName }
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.workoutService.deleteWorkoutLog(logId).subscribe({
          next: () => {
            this.refresh();
            this.snackBar.open('Workout log deleted successfully!', 'Close', {
              duration: SNACKBAR_SUCCESS_DURATION,
              panelClass: ['success-snackbar']
            });
          },
          error: (err) => {
            this.snackBar.open(err.message, 'Close', {
              duration: SNACKBAR_ERROR_DURATION,
              panelClass: ['error-snackbar']
            });
          }
        });
      }
    });
  }

  onEdit(workoutLogId: string): void {
    const dialogRef = this.dialog.open(WorkoutEditDialogComponent, {
      width: '700px',
      maxWidth: '95vw',
      panelClass: 'custom-dialog-container',
      autoFocus: false,
      data: { workoutLogId }
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.refresh();
      }
    });
  }
}
