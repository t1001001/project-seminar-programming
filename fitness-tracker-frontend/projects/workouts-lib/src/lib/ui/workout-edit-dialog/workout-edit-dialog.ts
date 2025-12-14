import { ChangeDetectionStrategy, Component, inject, signal, computed, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';

import { WorkoutLogicService, WorkoutLogWithExecutions, WorkoutExecutionInput } from '../../logic-services/workout-logic.service';
import { WorkoutCompleteConfirmDialogComponent } from '../workout-complete-confirm-dialog/workout-complete-confirm-dialog';

const SNACKBAR_SUCCESS_DURATION = 3000;
const SNACKBAR_ERROR_DURATION = 5000;

export interface WorkoutEditDialogData {
  workoutLogId: string;
}

@Component({
  selector: 'lib-workout-edit-dialog',
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    ReactiveFormsModule,
  ],
  templateUrl: './workout-edit-dialog.html',
  styleUrl: './workout-edit-dialog.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WorkoutEditDialogComponent implements OnInit, OnDestroy {
  private readonly dialogRef = inject(MatDialogRef<WorkoutEditDialogComponent>);
  private readonly data = inject<WorkoutEditDialogData>(MAT_DIALOG_DATA);
  private readonly fb = inject(FormBuilder);
  private readonly workoutService = inject(WorkoutLogicService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly dialog = inject(MatDialog);
  private changeSubscription?: Subscription;
  private initialSnapshot = '';

  readonly isLoading = signal(true);
  readonly isSaving = signal(false);
  readonly workoutData = signal<WorkoutLogWithExecutions | null>(null);
  readonly sessionStartTime = signal<string>('');
  readonly hasChanges = signal(false);

  readonly form: FormGroup = this.fb.group({
    notes: [''],
    executions: this.fb.array([])
  });

  readonly allCompleted = computed(() => {
    const executions = this.executionsArray.controls;
    return executions.length > 0 && executions.every((ctrl) => ctrl.get('completed')?.value === true);
  });

  get executionsArray(): FormArray {
    return this.form.get('executions') as FormArray;
  }

  get sessionName(): string {
    return this.workoutData()?.sessionName ?? '';
  }

  ngOnInit(): void {
    this.loadWorkout();
  }

  ngOnDestroy(): void {
    this.changeSubscription?.unsubscribe();
  }

  private loadWorkout(): void {
    this.isLoading.set(true);
    this.workoutService.getWorkoutLogWithExecutions(this.data.workoutLogId).subscribe({
      next: (workoutLog) => {
        this.workoutData.set(workoutLog);
        this.sessionStartTime.set(this.formatDateTime(workoutLog.startedAt));
        this.buildExecutionForms(workoutLog);
        this.form.patchValue({ notes: workoutLog.notes || '' });
        this.form.markAsPristine();
        this.setupChangeTracking();
        this.isLoading.set(false);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.snackBar.open(err.message, 'Close', {
          duration: SNACKBAR_ERROR_DURATION,
          panelClass: ['error-snackbar']
        });
        this.dialogRef.close(false);
      }
    });
  }

  private formatDateTime(dateString: string): string {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${day}/${month}/${year} - ${hours}:${minutes}`;
  }

  private buildExecutionForms(workoutLog: WorkoutLogWithExecutions): void {
    this.executionsArray.clear();

    workoutLog.executions.forEach((execution) => {
      const executionGroup = this.fb.group({
        id: [execution.id],
        exerciseName: [execution.exerciseName],
        exerciseCategory: [execution.exerciseCategory],
        plannedSets: [execution.exerciseExecutionPlannedSets],
        plannedReps: [execution.exerciseExecutionPlannedReps],
        plannedWeight: [execution.exerciseExecutionPlannedWeight],
        actualSets: [execution.actualSets ?? execution.exerciseExecutionPlannedSets, [Validators.required, Validators.min(0)]],
        actualReps: [execution.actualReps ?? execution.exerciseExecutionPlannedReps, [Validators.required, Validators.min(0)]],
        actualWeight: [execution.actualWeight ?? execution.exerciseExecutionPlannedWeight, [Validators.required, Validators.min(0)]],
        completed: [execution.completed ?? false],
        notes: [execution.notes || '']
      });

      this.executionsArray.push(executionGroup);
    });
  }

  private setupChangeTracking(): void {
    this.changeSubscription?.unsubscribe();
    this.initialSnapshot = JSON.stringify(this.form.getRawValue());
    this.hasChanges.set(false);
    this.changeSubscription = this.form.valueChanges.subscribe(() => {
      const currentSnapshot = JSON.stringify(this.form.getRawValue());
      this.hasChanges.set(currentSnapshot !== this.initialSnapshot);
    });
  }

  onSave(): void {
    if (this.form.invalid) {
      return;
    }

    const workoutLog = this.workoutData();
    if (!workoutLog) {
      return;
    }

    const allDone = this.executionsArray.length > 0 &&
      this.executionsArray.controls.every((ctrl) => !!ctrl.get('completed')?.value);

    const proceed = () => {
      this.isSaving.set(true);

      const executionUpdates: WorkoutExecutionInput[] = this.executionsArray.controls.map((ctrl) => ({
        id: ctrl.get('id')?.value,
        actualSets: ctrl.get('actualSets')?.value,
        actualReps: ctrl.get('actualReps')?.value,
        actualWeight: ctrl.get('actualWeight')?.value,
        completed: ctrl.get('completed')?.value ?? false,
        notes: ctrl.get('notes')?.value
      }));

      const notes = this.form.get('notes')?.value;

      this.workoutService.saveWorkout(workoutLog.id, executionUpdates, notes).subscribe({
        next: () => {
          this.isSaving.set(false);
          this.snackBar.open('Workout progress saved successfully.', 'Close', {
            duration: SNACKBAR_SUCCESS_DURATION,
            panelClass: ['success-snackbar']
          });
          this.dialogRef.close(true);
        },
        error: (err) => {
          this.isSaving.set(false);
          this.snackBar.open(err.message, 'Close', {
            duration: SNACKBAR_ERROR_DURATION,
            panelClass: ['error-snackbar']
          });
        }
      });
    };

    if (allDone) {
      const confirmRef = this.dialog.open(WorkoutCompleteConfirmDialogComponent, {
        width: '440px',
        panelClass: 'custom-dialog-container',
        data: { sessionName: this.sessionName }
      });

      confirmRef.afterClosed().subscribe((confirmed) => {
        if (confirmed) {
          proceed();
        }
      });
    } else {
      proceed();
    }
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}

