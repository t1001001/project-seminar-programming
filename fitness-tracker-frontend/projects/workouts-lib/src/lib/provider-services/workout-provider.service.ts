import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export type WorkoutStatus = 'InProgress' | 'Completed';

export interface WorkoutLog {
  id: string;
  sessionName: string;
  sessionPlanName: string;
  sessionPlan?: string;
  startedAt: string;
  completedAt?: string;
  status: WorkoutStatus;
  notes?: string;
  originalSessionId: string;
  executionLogCount?: number;
}

export interface WorkoutExecutionLog {
  id: string;
  exerciseExecutionId: number;
  exerciseExecutionPlannedSets: number;
  exerciseExecutionPlannedReps: number;
  exerciseExecutionPlannedWeight: number;
  exerciseId: string;
  exerciseName: string;
  exerciseCategory: string;
  exerciseMuscleGroup: string[];
  exerciseDescription?: string;
  actualSets?: number;
  actualReps?: number;
  actualWeight?: number;
  completed: boolean;
  notes?: string;
  sessionLogId: string;
}

export interface WorkoutExecutionLogUpdate {
  actualSets?: number;
  actualReps?: number;
  actualWeight?: number;
  completed?: boolean;
  notes?: string;
}

export interface WorkoutLogUpdate {
  notes?: string;
}

@Injectable({ providedIn: 'root' })
export class WorkoutProviderService {
  private readonly http = inject(HttpClient);
  private readonly workoutLogsApiUrl = 'http://localhost:8080/api/v1/session-logs';
  private readonly executionLogsApiUrl = 'http://localhost:8080/api/v1/execution-logs';

  startWorkout(sessionId: string): Observable<WorkoutLog> {
    return this.http.post<WorkoutLog>(`${this.workoutLogsApiUrl}/start/${sessionId}`, {});
  }

  completeWorkout(workoutLogId: string): Observable<WorkoutLog> {
    return this.http.put<WorkoutLog>(`${this.workoutLogsApiUrl}/${workoutLogId}/complete`, {});
  }



  getAllWorkoutLogs(): Observable<WorkoutLog[]> {
    return this.http.get<WorkoutLog[]>(this.workoutLogsApiUrl);
  }

  getWorkoutLogsBySessionId(sessionId: string): Observable<WorkoutLog[]> {
    return this.http.get<WorkoutLog[]>(`${this.workoutLogsApiUrl}?sessionId=${sessionId}`);
  }

  getWorkoutLogById(id: string): Observable<WorkoutLog> {
    return this.http.get<WorkoutLog>(`${this.workoutLogsApiUrl}/${id}`);
  }

  updateWorkoutLog(id: string, update: WorkoutLogUpdate): Observable<WorkoutLog> {
    return this.http.put<WorkoutLog>(`${this.workoutLogsApiUrl}/${id}`, update);
  }

  deleteWorkoutLog(id: string): Observable<void> {
    return this.http.delete<void>(`${this.workoutLogsApiUrl}/${id}`);
  }

  getExecutionLogsByWorkoutLogId(workoutLogId: string): Observable<WorkoutExecutionLog[]> {
    return this.http.get<WorkoutExecutionLog[]>(`${this.executionLogsApiUrl}?sessionLogId=${workoutLogId}`);
  }

  getExecutionLogById(id: string): Observable<WorkoutExecutionLog> {
    return this.http.get<WorkoutExecutionLog>(`${this.executionLogsApiUrl}/${id}`);
  }

  updateExecutionLog(id: string, update: WorkoutExecutionLogUpdate): Observable<WorkoutExecutionLog> {
    return this.http.put<WorkoutExecutionLog>(`${this.executionLogsApiUrl}/${id}`, update);
  }

  deleteExecutionLog(id: string): Observable<void> {
    return this.http.delete<void>(`${this.executionLogsApiUrl}/${id}`);
  }
}
