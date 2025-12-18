import { ChangeDetectionStrategy, Component, computed, inject, OnInit } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { BehaviorSubject, catchError, debounceTime, of, shareReplay, startWith, switchMap, tap } from 'rxjs';

import { WorkoutLogicService } from '../../logic-services/workout-logic.service';
import { WorkoutLog } from '../../provider-services/workout-provider.service';
import { WorkoutCardComponent } from '../../ui/workout-card/workout-card';
import { WorkoutDeleteDialogComponent } from '../../ui/workout-delete-dialog/workout-delete-dialog';
import { WorkoutEditDialogComponent } from '../../ui/workout-edit-dialog/workout-edit-dialog';
import { showError, showSuccess } from '../../shared';

@Component({
  selector: 'lib-workouts-overview',
  imports: [
    MatDialogModule,
    MatSnackBarModule,
    MatIconModule,
    ReactiveFormsModule,
    WorkoutCardComponent,
  ],
  templateUrl: './workouts-overview.html',
  styleUrl: './workouts-overview.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
/**
 * Component for displaying the history of past workouts.
 * Shows active and completed workouts with filtering capabilities.
 */
export class WorkoutsOverviewComponent implements OnInit {
  private readonly workoutService = inject(WorkoutLogicService);
  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);

  /** Control for filtering workout logs. */
  readonly searchControl = new FormControl('');
  private readonly refreshTrigger$ = new BehaviorSubject<void>(undefined);

  /** Signal holding workout logs, auto-refreshed on trigger or events. */
  private readonly workoutLogs = toSignal(
    this.refreshTrigger$.pipe(
      switchMap(() => this.workoutService.getActiveWorkoutLogs().pipe(
        catchError((err) => {
          showError(this.snackBar, err.message);
          return of([] as WorkoutLog[]);
        })
      )),
      tap(() => { }),
      shareReplay(1)
    ),
    { initialValue: [] as WorkoutLog[] }
  );

  /** Signal holding debounced search term. */
  private readonly searchTerm = toSignal(
    this.searchControl.valueChanges.pipe(startWith(''), debounceTime(200)),
    { initialValue: '' }
  );

  /**
   * Filtered list of workouts based on search term.
   * Matches against session name and plan name.
   */
  readonly filteredWorkouts = computed(() => {
    const workouts = this.workoutLogs();
    if (!workouts) return undefined;

    const term = (this.searchTerm() || '').toLowerCase();
    return workouts.filter(workout =>
      workout.sessionName.toLowerCase().includes(term) ||
      (workout.sessionPlanName?.toLowerCase() || '').includes(term)
    );
  });

  /** Total count of workouts in the history. */
  readonly totalWorkoutsCount = computed(() => this.workoutLogs()?.length ?? 0);

  /**
   * subscribes to workout events to auto-refresh the list.
   */
  ngOnInit(): void {
    this.workoutService.workoutCompleted$.subscribe(() => this.refresh());
    this.workoutService.workoutSaved$.subscribe(() => this.refresh());
  }

  /** Manually triggers a reload of the workout history. */
  refresh(): void {
    this.refreshTrigger$.next();
  }

  /**
   * Opens confirmation dialog to delete a workout log.
   * @param logId - ID of the workout log to delete
   * @param sessionName - Name of the session for confirmation message
   */
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
            showSuccess(this.snackBar, 'Workout log deleted successfully!');
          },
          error: (err) => showError(this.snackBar, err.message)
        });
      }
    });
  }

  /**
   * Opens the edit dialog for a specific workout log.
   * @param workoutLogId - ID of the workout log to edit
   */
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
