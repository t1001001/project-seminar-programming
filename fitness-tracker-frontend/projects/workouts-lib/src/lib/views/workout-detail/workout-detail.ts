import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

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
  ],
  templateUrl: './workout-detail.html',
  styleUrl: './workout-detail.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class WorkoutDetailComponent implements OnInit {
  private readonly location = inject(Location);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly workoutService = inject(WorkoutLogicService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly dialog = inject(MatDialog);

  private workoutLogId: string | null = null;
  readonly workoutLog = signal<WorkoutLogWithExecutions | null>(null);

  ngOnInit(): void {
    this.workoutLogId = this.route.snapshot.paramMap.get('id');
    if (this.workoutLogId) {
      this.loadWorkoutLog(this.workoutLogId);
    } else {
      this.router.navigate(['/workouts']);
    }
  }

  onBack(): void {
    this.location.back();
  }

  onEdit(): void {
    if (!this.workoutLogId) {
      return;
    }

    const dialogRef = this.dialog.open(WorkoutEditDialogComponent, {
      width: '700px',
      maxWidth: '95vw',
      panelClass: 'custom-dialog-container',
      autoFocus: false,
      data: { workoutLogId: this.workoutLogId }
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.refresh();
      }
    });
  }

  refresh(): void {
    if (this.workoutLogId) {
      this.loadWorkoutLog(this.workoutLogId);
    }
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

  private loadWorkoutLog(id: string): void {
    this.workoutService.getWorkoutLogWithExecutions(id).subscribe({
      next: (log) => this.workoutLog.set(log),
      error: (err) => {
        showError(this.snackBar, err.message);
        this.router.navigate(['/workouts']);
      }
    });
  }
}

