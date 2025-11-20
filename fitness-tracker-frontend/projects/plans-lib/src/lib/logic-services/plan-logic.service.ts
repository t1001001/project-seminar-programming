import { Injectable, inject } from '@angular/core';
import { Observable, Subject, tap, catchError, throwError } from 'rxjs';
import { PlanProviderService, TrainingPlan, TrainingPlanCreate, TrainingPlanUpdate } from '../provider-services/plan-provider.service';

@Injectable({ providedIn: 'root' })
export class PlanLogicService {
  private planProviderService = inject(PlanProviderService);

  private createdPlanSubject = new Subject<TrainingPlan>();
  createdPlan$ = this.createdPlanSubject.asObservable();

  createPlan(plan: TrainingPlanCreate): Observable<TrainingPlan> {
    return this.planProviderService.createPlan(plan).pipe(
      tap((createdPlan) => {
        this.createdPlanSubject.next(createdPlan);
      }),
      catchError((err) => {
        let errorMessage = 'Failed to create training plan';

        if (err.status === 409) {
          errorMessage = err.error || 'Training plan with this name already exists';
        } else if (err.status === 400) {
          errorMessage = 'Invalid training plan data. Please check all required fields.';
        } else if (err.status === 0) {
          errorMessage = 'Cannot connect to server. Please check your connection.';
        }

        return throwError(() => new Error(errorMessage));
      })
    );
  }

  getAllPlans(): Observable<TrainingPlan[]> {
    return this.planProviderService.getAllPlans()
      .pipe(
        tap((plans: TrainingPlan[]) => {
          // Calculate sessionsCount since backend doesn't provide it
          plans.forEach(plan => {
            plan.sessionsCount = plan.sessions ? plan.sessions.length : 0;
          });
          console.log(plans);
        }),
        catchError((err) => {
          let errorMessage = 'Failed to load training plans';

          if (err.status === 0) {
            errorMessage = 'Cannot connect to server. Please check your connection.';
          }

          return throwError(() => new Error(errorMessage));
        })
      );
  }

  getPlanById(id: string): Observable<TrainingPlan> {
    return this.planProviderService.getPlanById(id).pipe(
      catchError((err) => {
        let errorMessage = 'Failed to load training plan details';

        if (err.status === 404) {
          errorMessage = 'Training plan not found. It may have been deleted.';
        } else if (err.status === 0) {
          errorMessage = 'Cannot connect to server. Please check your connection.';
        }

        return throwError(() => new Error(errorMessage));
      })
    );
  }

  updatePlan(id: string, plan: TrainingPlanUpdate): Observable<TrainingPlan> {
    return this.planProviderService.updatePlan(id, plan).pipe(
      catchError((err) => {
        let errorMessage = 'Failed to update training plan';

        if (err.status === 404) {
          errorMessage = 'Training plan not found. It may have been deleted.';
        } else if (err.status === 409) {
          errorMessage = err.error || 'Training plan with this name already exists';
        } else if (err.status === 400) {
          errorMessage = 'Invalid training plan data. Please check all required fields.';
        } else if (err.status === 0) {
          errorMessage = 'Cannot connect to server. Please check your connection.';
        }

        return throwError(() => new Error(errorMessage));
      })
    );
  }

  deletePlan(id: string): Observable<void> {
    return this.planProviderService.deletePlan(id).pipe(
      catchError((err) => {
        let errorMessage = 'Failed to delete training plan';

        if (err.status === 404) {
          errorMessage = 'Training plan not found. It may have been already deleted.';
        } else if (err.status === 0) {
          errorMessage = 'Cannot connect to server. Please check your connection.';
        }

        return throwError(() => new Error(errorMessage));
      })
    );
  }
}
