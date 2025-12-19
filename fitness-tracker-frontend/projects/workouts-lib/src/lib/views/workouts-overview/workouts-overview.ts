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

export class WorkoutsOverviewComponent implements OnInit {
  private readonly workoutService = inject(WorkoutLogicService);
  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);

  readonly searchControl = new FormControl('');
  private readonly refreshTrigger$ = new BehaviorSubject<void>(undefined);

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

  private readonly searchTerm = toSignal(
    this.searchControl.valueChanges.pipe(startWith(''), debounceTime(200)),
    { initialValue: '' }
  );

  readonly filteredWorkouts = computed(() => {
    const workouts = this.workoutLogs();
    if (!workouts) return undefined;

    const term = (this.searchTerm() || '').toLowerCase();
    return workouts.filter(workout =>
      workout.sessionName.toLowerCase().includes(term) ||
      (workout.sessionPlanName?.toLowerCase() || '').includes(term)
    );
  });

  readonly totalWorkoutsCount = computed(() => this.workoutLogs()?.length ?? 0);


  ngOnInit(): void {
    this.workoutService.workoutCompleted$.subscribe(() => this.refresh());
    this.workoutService.workoutSaved$.subscribe(() => this.refresh());
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
            showSuccess(this.snackBar, 'Workout log deleted successfully!');
          },
          error: (err) => showError(this.snackBar, err.message)
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
