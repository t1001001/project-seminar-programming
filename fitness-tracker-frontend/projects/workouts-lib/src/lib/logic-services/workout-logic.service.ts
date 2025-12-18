import { Injectable, inject } from '@angular/core';
import { Observable, Subject, catchError, forkJoin, map, of, switchMap, tap } from 'rxjs';
import {
  WorkoutProviderService,
  WorkoutLog,
  WorkoutExecutionLog,
  WorkoutExecutionLogUpdate,
} from '../provider-services/workout-provider.service';
import { handleWorkoutError, createWorkoutErrorConfig } from '../shared';

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

  private readonly workoutCompletedSubject = new Subject<WorkoutLog>();
  workoutCompleted$ = this.workoutCompletedSubject.asObservable();

  private readonly workoutSavedSubject = new Subject<WorkoutLog>();
  workoutSaved$ = this.workoutSavedSubject.asObservable();

  private readonly workoutCancelledSubject = new Subject<WorkoutLog>();
  workoutCancelled$ = this.workoutCancelledSubject.asObservable();

  startWorkout(sessionId: string): Observable<WorkoutLogWithExecutions> {
    return this.workoutProvider.startWorkout(sessionId).pipe(
      switchMap((workoutLog) => this.enrichWithExecutions(workoutLog)),
      catchError((err) => handleWorkoutError(err, createWorkoutErrorConfig('start')))
    );
  }

  getWorkoutLogWithExecutions(workoutLogId: string): Observable<WorkoutLogWithExecutions> {
    return this.workoutProvider.getWorkoutLogById(workoutLogId).pipe(
      switchMap((workoutLog) => this.enrichWithExecutions(workoutLog)),
      catchError((err) => handleWorkoutError(err, createWorkoutErrorConfig('load')))
    );
  }

  saveWorkout(
    workoutLogId: string,
    executionUpdates: WorkoutExecutionInput[],
    notes?: string
  ): Observable<WorkoutLog> {
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

    const workoutUpdateCall = notes !== undefined
      ? this.workoutProvider.updateWorkoutLog(workoutLogId, { notes })
      : of(null);

    const allCompleted = executionUpdates.every((update) => update.completed);

    return forkJoin([workoutUpdateCall, ...executionUpdateCalls]).pipe(
      switchMap(() => allCompleted
        ? this.workoutProvider.completeWorkout(workoutLogId)
        : this.workoutProvider.getWorkoutLogById(workoutLogId)
      ),
      tap((workout) => {
        if (workout.status === 'Completed') {
          this.workoutCompletedSubject.next(workout);
        } else {
          this.workoutSavedSubject.next(workout);
        }
      }),
      catchError((err) => handleWorkoutError(err, createWorkoutErrorConfig('save')))
    );
  }

  completeWorkout(
    workoutLogId: string,
    executionUpdates: WorkoutExecutionInput[],
    notes?: string
  ): Observable<WorkoutLog> {
    return this.saveWorkout(workoutLogId, executionUpdates, notes);
  }

  cancelWorkout(workoutLogId: string): Observable<WorkoutLog> {
    return this.workoutProvider.cancelWorkout(workoutLogId).pipe(
      tap((cancelledWorkout) => this.workoutCancelledSubject.next(cancelledWorkout)),
      catchError((err) => handleWorkoutError(err, createWorkoutErrorConfig('cancel')))
    );
  }

  getAllWorkoutLogs(): Observable<WorkoutLog[]> {
    return this.workoutProvider.getAllWorkoutLogs().pipe(
      map((logs) => logs.sort((a, b) =>
        new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime()
      )),
      catchError((err) => handleWorkoutError(err, createWorkoutErrorConfig('loadAll')))
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
      catchError((err) => handleWorkoutError(err, createWorkoutErrorConfig('delete')))
    );
  }

  private enrichWithExecutions(workoutLog: WorkoutLog): Observable<WorkoutLogWithExecutions> {
    return this.workoutProvider.getExecutionLogsByWorkoutLogId(workoutLog.id).pipe(
      map((executions) => ({
        ...workoutLog,
        executions: executions.sort((a, b) => a.exerciseExecutionId - b.exerciseExecutionId)
      })),
      catchError(() => of({ ...workoutLog, executions: [] as WorkoutExecutionLog[] }))
    );
  }
}
