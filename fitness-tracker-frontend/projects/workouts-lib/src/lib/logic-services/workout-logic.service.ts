import { Injectable, inject } from '@angular/core';
import { Observable, Subject, catchError, forkJoin, map, of, switchMap, tap, throwError } from 'rxjs';
import {
  WorkoutProviderService,
  WorkoutLog,
  WorkoutExecutionLog,
  WorkoutExecutionLogUpdate,
  WorkoutLogUpdate
} from '../provider-services/workout-provider.service';

export interface WorkoutLogWithExecutions extends WorkoutLog {
  executions: WorkoutExecutionLog[];
}

export interface WorkoutExecutionInput {
  id: string;
  actualSets: number;
  actualReps: number;
  actualWeight: number;
  completed: boolean;
  notes?: string;
}

@Injectable({ providedIn: 'root' })
export class WorkoutLogicService {
  private readonly workoutProvider = inject(WorkoutProviderService);

  // Event emission for cross-component communication
  private readonly workoutCompletedSubject = new Subject<WorkoutLog>();
  workoutCompleted$ = this.workoutCompletedSubject.asObservable();

  private readonly workoutSavedSubject = new Subject<WorkoutLog>();
  workoutSaved$ = this.workoutSavedSubject.asObservable();

  private readonly workoutCancelledSubject = new Subject<WorkoutLog>();
  workoutCancelled$ = this.workoutCancelledSubject.asObservable();

  startWorkout(sessionId: string): Observable<WorkoutLogWithExecutions> {
    return this.workoutProvider.startWorkout(sessionId).pipe(
      switchMap((workoutLog) =>
        this.workoutProvider.getExecutionLogsByWorkoutLogId(workoutLog.id).pipe(
          map((executions) => ({
            ...workoutLog,
            executions: executions.sort((a, b) => a.exerciseExecutionId - b.exerciseExecutionId)
          })),
          catchError(() => of({ ...workoutLog, executions: [] as WorkoutExecutionLog[] }))
        )
      ),
      catchError((err) => {
        let errorMessage = 'Failed to start workout';

        if (err.status === 404) {
          errorMessage = 'Workout session not found. It may have been deleted.';
        } else if (err.status === 0) {
          errorMessage = 'Cannot connect to server. Please check your connection.';
        }

        return throwError(() => new Error(errorMessage));
      })
    );
  }

  getWorkoutLogWithExecutions(workoutLogId: string): Observable<WorkoutLogWithExecutions> {
    return this.workoutProvider.getWorkoutLogById(workoutLogId).pipe(
      switchMap((workoutLog) =>
        this.workoutProvider.getExecutionLogsByWorkoutLogId(workoutLog.id).pipe(
          map((executions) => ({
            ...workoutLog,
            executions: executions.sort((a, b) => a.exerciseExecutionId - b.exerciseExecutionId)
          })),
          catchError(() => of({ ...workoutLog, executions: [] as WorkoutExecutionLog[] }))
        )
      ),
      catchError((err) => {
        let errorMessage = 'Failed to load workout log';

        if (err.status === 404) {
          errorMessage = 'Workout log not found.';
        } else if (err.status === 0) {
          errorMessage = 'Cannot connect to server. Please check your connection.';
        }

        return throwError(() => new Error(errorMessage));
      })
    );
  }

  saveWorkout(
    workoutLogId: string,
    executionUpdates: WorkoutExecutionInput[],
    notes?: string
  ): Observable<WorkoutLog> {
    // Update all execution logs
    const executionUpdateCalls = executionUpdates.map((update) => {
      const payload: WorkoutExecutionLogUpdate = {
        actualSets: update.actualSets,
        actualReps: update.actualReps,
        actualWeight: update.actualWeight,
        completed: update.completed,
        notes: update.notes
      };
      return this.workoutProvider.updateExecutionLog(update.id, payload);
    });

    // Update the workout log notes if provided
    const workoutUpdateCall = notes !== undefined
      ? this.workoutProvider.updateWorkoutLog(workoutLogId, { notes })
      : of(null);

    // Check if all exercises are completed
    const allCompleted = executionUpdates.every((update) => update.completed);

    return forkJoin([workoutUpdateCall, ...executionUpdateCalls]).pipe(
      switchMap(() => {
        if (allCompleted) {
          // Complete the workout if all exercises are done
          return this.workoutProvider.completeWorkout(workoutLogId);
        } else {
          // Just return the updated workout log (stays InProgress)
          return this.workoutProvider.getWorkoutLogById(workoutLogId);
        }
      }),
      tap((workout) => {
        if (workout.status === 'Completed') {
          this.workoutCompletedSubject.next(workout);
        } else {
          this.workoutSavedSubject.next(workout);
        }
      }),
      catchError((err) => {
        let errorMessage = 'Failed to save workout';

        if (err.status === 404) {
          errorMessage = 'Workout log not found. It may have been deleted.';
        } else if (err.status === 400) {
          errorMessage = 'Invalid workout data. Please check all fields.';
        } else if (err.status === 0) {
          errorMessage = 'Cannot connect to server. Please check your connection.';
        }

        return throwError(() => new Error(errorMessage));
      })
    );
  }

  completeWorkout(
    workoutLogId: string,
    executionUpdates: WorkoutExecutionInput[],
    notes?: string
  ): Observable<WorkoutLog> {
    // Legacy method - now just calls saveWorkout
    return this.saveWorkout(workoutLogId, executionUpdates, notes);
  }

  cancelWorkout(workoutLogId: string): Observable<WorkoutLog> {
    return this.workoutProvider.cancelWorkout(workoutLogId).pipe(
      tap((cancelledWorkout) => {
        this.workoutCancelledSubject.next(cancelledWorkout);
      }),
      catchError((err) => {
        let errorMessage = 'Failed to cancel workout';

        if (err.status === 404) {
          errorMessage = 'Workout log not found. It may have been deleted.';
        } else if (err.status === 0) {
          errorMessage = 'Cannot connect to server. Please check your connection.';
        }

        return throwError(() => new Error(errorMessage));
      })
    );
  }

  getAllWorkoutLogs(): Observable<WorkoutLog[]> {
    return this.workoutProvider.getAllWorkoutLogs().pipe(
      map((logs) => logs.sort((a, b) =>
        new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime()
      )),
      catchError((err) => {
        let errorMessage = 'Failed to load workout logs';

        if (err.status === 0) {
          errorMessage = 'Cannot connect to server. Please check your connection.';
        }

        return throwError(() => new Error(errorMessage));
      })
    );
  }

  getCompletedWorkoutLogs(): Observable<WorkoutLog[]> {
    return this.getAllWorkoutLogs().pipe(
      map((logs) => logs.filter((log) => log.status === 'Completed'))
    );
  }

  getInProgressWorkoutLogs(): Observable<WorkoutLog[]> {
    return this.getAllWorkoutLogs().pipe(
      map((logs) => logs.filter((log) => log.status === 'InProgress'))
    );
  }

  getActiveWorkoutLogs(): Observable<WorkoutLog[]> {
    return this.getAllWorkoutLogs().pipe(
      map((logs) => logs.filter((log) => log.status === 'Completed' || log.status === 'InProgress'))
    );
  }

  deleteWorkoutLog(id: string): Observable<void> {
    return this.workoutProvider.deleteWorkoutLog(id).pipe(
      catchError((err) => {
        let errorMessage = 'Failed to delete workout log';

        if (err.status === 404) {
          errorMessage = 'Workout log not found. It may have been already deleted.';
        } else if (err.status === 0) {
          errorMessage = 'Cannot connect to server. Please check your connection.';
        }

        return throwError(() => new Error(errorMessage));
      })
    );
  }
}
