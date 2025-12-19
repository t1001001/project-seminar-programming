import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { AsyncPipe } from '@angular/common';
import { BehaviorSubject, Observable, catchError, of, switchMap } from 'rxjs';

import { WorkoutLogicService, WorkoutLogWithExecutions } from '../../logic-services/workout-logic.service';
import { WorkoutEditDialogComponent } from '../../ui/workout-edit-dialog/workout-edit-dialog';
import { showError } from '../../shared';

@Component({
  selector: 'lib-workout-detail',
  imports: [
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatSnackBarModule,
    MatDialogModule,
    AsyncPipe,
  ],
  templateUrl: './workout-detail.html',
  styleUrl: './workout-detail.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class WorkoutDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly workoutService = inject(WorkoutLogicService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly dialog = inject(MatDialog);

  private readonly refreshTrigger$ = new BehaviorSubject<void>(undefined);

  workoutLog$: Observable<WorkoutLogWithExecutions | null> | null = null;
  private currentWorkoutLogId: string | null = null;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.currentWorkoutLogId = id;
      this.workoutLog$ = this.refreshTrigger$.pipe(
        switchMap(() => this.workoutService.getWorkoutLogWithExecutions(id)),
        catchError((err) => {
          showError(this.snackBar, err.message);
          this.router.navigate(['/workouts']);
          return of(null);
        })
      );
    } else {
      this.router.navigate(['/workouts']);
    }
  }

  onBack(): void {
    this.router.navigate(['/workouts']);
  }

  onEdit(): void {
    if (!this.currentWorkoutLogId) {
      return;
    }

    const dialogRef = this.dialog.open(WorkoutEditDialogComponent, {
      width: '700px',
      maxWidth: '95vw',
      panelClass: 'custom-dialog-container',
      autoFocus: false,
      data: { workoutLogId: this.currentWorkoutLogId }
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.refreshTrigger$.next();
      }
    });
  }

  formatDateTime(dateStr: string): string {
    const date = new Date(dateStr);
    const dateFormatted = date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
    const timeFormatted = date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
    return `${dateFormatted} at ${timeFormatted}`;
  }
}
