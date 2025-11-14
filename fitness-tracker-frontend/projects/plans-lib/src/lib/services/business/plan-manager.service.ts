import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Plan } from '../../domain/models/plan.model';
import { PlanApiProvider } from '../providers/plan-api.provider';

@Injectable({ providedIn: 'root' })
export class PlanManagerService {
  private readonly provider = inject(PlanApiProvider);

  loadPlans(): Observable<Plan[]> {
    return this.provider.getPlans();
  }
}
