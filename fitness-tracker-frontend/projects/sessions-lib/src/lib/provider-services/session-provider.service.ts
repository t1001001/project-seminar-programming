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

@Injectable({ providedIn: 'root' })
export class SessionProviderService {
  private http = inject(HttpClient);
  private sessionsApiUrl = 'http://localhost:8080/api/v1/sessions';
  private plansApiUrl = 'http://localhost:8080/api/v1/plans';
  private exerciseExecutionsApiUrl = 'http://localhost:8080/api/v1/exercise-executions';

  getAllSessions(): Observable<Session[]> {
    return this.http.get<Session[]>(this.sessionsApiUrl);
  }

  getPlans(): Observable<PlanSummary[]> {
    return this.http.get<PlanSummary[]>(this.plansApiUrl);
  }

  getExerciseExecutionsBySession(sessionId: string): Observable<ExerciseExecution[]> {
    return this.http.get<ExerciseExecution[]>(
      `${this.exerciseExecutionsApiUrl}?sessionId=${sessionId}`
    );
  }
}
