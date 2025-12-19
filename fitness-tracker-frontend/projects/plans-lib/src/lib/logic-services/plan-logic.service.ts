import { Injectable, inject } from '@angular/core';
import { Observable, Subject, tap, catchError } from 'rxjs';
import { PlanProviderService, TrainingPlan, TrainingPlanCreate, TrainingPlanUpdate } from '../provider-services/plan-provider.service';
import { handlePlanError, createPlanErrorConfig } from '../shared';

@Injectable({ providedIn: 'root' })
export class PlanLogicService {
  private readonly planProviderService = inject(PlanProviderService);

  private createdPlanSubject = new Subject<TrainingPlan>();
  createdPlan$ = this.createdPlanSubject.asObservable();

  createPlan(plan: TrainingPlanCreate): Observable<TrainingPlan> {
    return this.planProviderService.createPlan(plan).pipe(
      tap((createdPlan) => this.createdPlanSubject.next(createdPlan)),
      catchError((err) => handlePlanError(err, createPlanErrorConfig('create')))
    );
  }

  getAllPlans(): Observable<TrainingPlan[]> {
    return this.planProviderService.getAllPlans().pipe(
      catchError((err) => handlePlanError(err, createPlanErrorConfig('loadAll')))
    );
  }

  getPlanById(id: string): Observable<TrainingPlan> {
    return this.planProviderService.getPlanById(id).pipe(
      catchError((err) => handlePlanError(err, createPlanErrorConfig('load')))
    );
  }

  updatePlan(id: string, plan: TrainingPlanUpdate): Observable<TrainingPlan> {
    return this.planProviderService.updatePlan(id, plan).pipe(
      catchError((err) => handlePlanError(err, createPlanErrorConfig('update')))
    );
  }

  deletePlan(id: string): Observable<void> {
    return this.planProviderService.deletePlan(id).pipe(
      catchError((err) => handlePlanError(err, createPlanErrorConfig('delete')))
    );
  }
}
