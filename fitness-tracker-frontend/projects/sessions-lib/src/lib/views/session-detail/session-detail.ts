import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { AsyncPipe } from '@angular/common';
import { BehaviorSubject, Observable, catchError, of, switchMap } from 'rxjs';

import { SessionDetail, SessionLogicService } from '../../logic-services/session-logic.service';
import { SessionEditDialogComponent } from '../../ui/session-edit-dialog/session-edit-dialog';
import { WorkoutLogicService, WorkoutStartDialogComponent } from 'workouts-lib';

const SNACKBAR_SUCCESS_DURATION = 3000;
const SNACKBAR_ERROR_DURATION = 5000;

@Component({
  selector: 'lib-session-detail',
  imports: [
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatDialogModule,
    AsyncPipe,
  ],
  templateUrl: './session-detail.html',
  styleUrl: './session-detail.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SessionDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly sessionService = inject(SessionLogicService);
  private readonly workoutService = inject(WorkoutLogicService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly dialog = inject(MatDialog);

  private readonly refreshTrigger$ = new BehaviorSubject<void>(undefined);
  session$: Observable<SessionDetail | null> | null = null;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.session$ = this.refreshTrigger$.pipe(
        switchMap(() => this.sessionService.getSessionDetail(id)),
        catchError((err) => {
          this.snackBar.open(err.message, 'Close', {
            duration: SNACKBAR_ERROR_DURATION,
            panelClass: ['error-snackbar']
          });
          this.router.navigate(['/sessions']);
          return of(null);
        })
      );
    } else {
      this.router.navigate(['/sessions']);
    }
  }

  onBack(): void {
    this.router.navigate(['/sessions']);
  }

  onEdit(session: SessionDetail): void {
    const dialogRef = this.dialog.open(SessionEditDialogComponent, {
      width: '900px',
      maxWidth: '96vw',
      panelClass: 'custom-dialog-container',
      data: { session }
    });

    dialogRef.afterClosed().subscribe((updated: boolean) => {
      if (updated) {
        this.refresh();
        this.snackBar.open('Session updated successfully!', 'Close', {
          duration: SNACKBAR_SUCCESS_DURATION,
          panelClass: ['success-snackbar']
        });
      }
    });
  }

  onStart(session: SessionDetail): void {
    // Validate session has at least one exercise
    if (!session.exercises || session.exercises.length === 0) {
      this.snackBar.open('Cannot start workout: Session must contain at least one exercise.', 'Close', {
        duration: SNACKBAR_ERROR_DURATION,
        panelClass: ['error-snackbar']
      });
      return;
    }

    const confirmRef = this.dialog.open(WorkoutStartDialogComponent, {
      width: '420px',
      panelClass: 'custom-dialog-container',
      data: { sessionName: session.name }
    });

    confirmRef.afterClosed().subscribe((confirmed: boolean) => {
      if (!confirmed) {
        return;
      }

      this.workoutService.startWorkout(session.id).subscribe({
        next: (workoutLog) => {
          this.snackBar.open('Workout created successfully. Redirecting...', 'Close', {
            duration: SNACKBAR_SUCCESS_DURATION,
            panelClass: ['success-snackbar']
          });
          this.router.navigate(['/workouts', workoutLog.id]);
        },
        error: (err) => {
          this.snackBar.open(err.message, 'Close', {
            duration: SNACKBAR_ERROR_DURATION,
            panelClass: ['error-snackbar']
          });
        }
      });
    });
  }

  refresh(): void {
    this.refreshTrigger$.next();
  }

  navigateToExercise(exercise: any): void {
    if (exercise.exerciseId) {
      this.router.navigate(['/exercises', exercise.exerciseId]);
    }
  }
}
