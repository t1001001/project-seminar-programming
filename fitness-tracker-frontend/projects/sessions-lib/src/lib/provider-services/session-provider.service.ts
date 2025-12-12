import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Session {
  id: string;
  name: string;
  planId?: string;
  orderID?: number;
  sessionLogCount?: number;
  exerciseExecutionsCount?: number;
}

export interface PlanSummary {
  id: string;
  name: string;
}

export interface SessionCreate {
  name: string;
  planId: string;
  orderID?: number;
}

export interface SessionUpdate {
  name: string;
  planId: string;
  orderID?: number;
}

export interface ExerciseExecution {
  id: string;
  orderID: number;
  exerciseName: string;
  exerciseId?: string;
  sessionId?: string;
  sessionName?: string;
  plannedSets?: number;
  plannedReps?: number;
  plannedWeight?: number;
}

export interface ExerciseExecutionCreate {
  sessionId: string;
  exerciseId: string;
  orderID?: number;
  plannedSets: number;
  plannedReps: number;
  plannedWeight: number;
}

export interface ExerciseExecutionUpdate {
  exerciseId?: string;
  orderID?: number;
  plannedSets?: number;
  plannedReps?: number;
  plannedWeight?: number;
}

@Injectable({ providedIn: 'root' })
export class SessionProviderService {
  private readonly http = inject(HttpClient);
  private readonly sessionsApiUrl = 'http://localhost:8080/api/v1/sessions';
  private readonly plansApiUrl = 'http://localhost:8080/api/v1/plans';
  private readonly exerciseExecutionsApiUrl = 'http://localhost:8080/api/v1/exercise-executions';

  getAllSessions(): Observable<Session[]> {
    return this.http.get<Session[]>(this.sessionsApiUrl);
  }

  getSessionById(id: string): Observable<Session> {
    return this.http.get<Session>(`${this.sessionsApiUrl}/${id}`);
  }

  getPlans(): Observable<PlanSummary[]> {
    return this.http.get<PlanSummary[]>(this.plansApiUrl);
  }

  getExerciseExecutionsBySession(sessionId: string): Observable<ExerciseExecution[]> {
    return this.http.get<ExerciseExecution[]>(
      `${this.exerciseExecutionsApiUrl}?sessionId=${sessionId}`
    );
  }

  createSession(session: SessionCreate): Observable<Session> {
    return this.http.post<Session>(this.sessionsApiUrl, session);
  }

  updateSession(id: string, session: SessionUpdate): Observable<Session> {
    return this.http.put<Session>(`${this.sessionsApiUrl}/${id}`, session);
  }

  createExerciseExecution(execution: ExerciseExecutionCreate): Observable<ExerciseExecution> {
    return this.http.post<ExerciseExecution>(this.exerciseExecutionsApiUrl, execution);
  }

  updateExerciseExecution(id: string, execution: ExerciseExecutionUpdate): Observable<ExerciseExecution> {
    return this.http.put<ExerciseExecution>(`${this.exerciseExecutionsApiUrl}/${id}`, execution);
  }

  deleteExerciseExecution(id: string): Observable<void> {
    return this.http.delete<void>(`${this.exerciseExecutionsApiUrl}/${id}`);
  }

  deleteSession(id: string): Observable<void> {
    return this.http.delete<void>(`${this.sessionsApiUrl}/${id}`);
  }
}
