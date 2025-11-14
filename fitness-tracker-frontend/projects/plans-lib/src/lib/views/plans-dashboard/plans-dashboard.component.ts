import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Plan } from '../../domain/models/plan.model';
import { PlanManagerService } from '../../services/business/plan-manager.service';
import { PlanCardComponent } from '../../ui/plan-card/plan-card.component';

@Component({
  selector: 'pl-plans-dashboard',
  standalone: true,
  imports: [CommonModule, PlanCardComponent],
  template: `
    <section class="plan-dashboard">
      <h2>Plans</h2>

      <ng-container *ngIf="plans$ | async as plans; else loading">
        <p *ngIf="!plans.length" class="empty-state">
          No plans configured yet.
        </p>
        <div *ngIf="plans.length" class="list">
          <pl-plan-card *ngFor="let plan of plans" [plan]="plan" />
        </div>
      </ng-container>

      <ng-template #loading>
        <p>Loading plans…</p>
      </ng-template>
    </section>
  `,
  styles: [
    `
      .plan-dashboard {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }

      .list {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
        gap: 1rem;
      }

      .empty-state {
        color: #475569;
        font-style: italic;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlansDashboardComponent {
  private readonly planManager = inject(PlanManagerService);
  readonly plans$: Observable<Plan[]> = this.planManager.loadPlans();
}
