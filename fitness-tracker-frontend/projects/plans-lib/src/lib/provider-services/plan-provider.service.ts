import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Exercise } from 'exercises-lib';

export interface ExerciseExecution {
  id: string;
  plannedSets: number;
  plannedReps: number;
  plannedWeight: number;
  orderID: number;
  sessionId: string;
  sessionName: string;
  exercise: Exercise;
}

export interface Session {
  id?: string;
  planId?: string;
  name: string;
  scheduledDate: string;
  orderID?: number;
  sessionLogCount?: number;
  exerciseCount?: number;
  status?: 'PLANNED' | 'COMPLETED';
  exerciseExecutions?: ExerciseExecution[];
}

export interface SessionCreate {
  planId?: string;
  name: string;
  scheduledDate: string;
  orderID?: number;
  status?: 'PLANNED' | 'COMPLETED';
}

export interface SessionUpdate {
  planId?: string;
  name: string;
  scheduledDate: string;
  orderID?: number;
  status?: 'PLANNED' | 'COMPLETED';
}

export interface TrainingPlan {
  id: string;
  name: string;
  description: string;
  sessions?: Session[];
}

export interface TrainingPlanCreate {
  name: string;
  description: string;
  sessions?: Session[];
}

export interface TrainingPlanUpdate {
  name: string;
  description: string;
  sessions: string[];
}

@Injectable({ providedIn: 'root' })
export class PlanProviderService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/v1/plans';
  private sessionsApiUrl = 'http://localhost:8080/api/v1/sessions';

  getAllPlans(): Observable<TrainingPlan[]> {
    return this.http.get<TrainingPlan[]>(this.apiUrl);
  }

  createPlan(plan: TrainingPlanCreate): Observable<TrainingPlan> {
    return this.http.post<TrainingPlan>(this.apiUrl, plan);
  }

  getPlanById(id: string): Observable<TrainingPlan> {
    return this.http.get<TrainingPlan>(`${this.apiUrl}/${id}`);
  }

  updatePlan(id: string, plan: TrainingPlanUpdate): Observable<TrainingPlan> {
    return this.http.put<TrainingPlan>(`${this.apiUrl}/${id}`, plan);
  }

  deletePlan(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Session Methods

  createSession(session: SessionCreate): Observable<Session> {
    return this.http.post<Session>(this.sessionsApiUrl, session);
  }

  getSessionById(id: string): Observable<Session> {
    return this.http.get<Session>(`${this.sessionsApiUrl}/${id}`);
  }

  updateSession(id: string, session: SessionUpdate): Observable<Session> {
    return this.http.put<Session>(`${this.sessionsApiUrl}/${id}`, session);
  }

  deleteSession(id: string): Observable<void> {
    return this.http.delete<void>(`${this.sessionsApiUrl}/${id}`);
  }
}
