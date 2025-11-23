import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Exercise } from 'exercises-lib';

export interface Session {
  id?: string;
  name: string;
  scheduledDate: string;
  status?: string;
  exerciseExecutions?: Exercise[];
}

export interface TrainingPlan {
  id: string;
  name: string;
  description: string;
  sessionsCount?: number;
  sessions?: Session[];
}

export interface TrainingPlanCreate {
  name: string;
  description: string;
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
}
