import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Plan } from '../../domain/models/plan.model';

@Injectable({ providedIn: 'root' })
export class PlanApiProvider {
  getPlans(): Observable<Plan[]> {
    return of([]);
  }
}
