import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Plan } from '../../domain/models/plan.model';
import { PlanManagerService } from '../../services/business/plan-manager.service';
import { PlanCardComponent } from '../../ui/plan-card/plan-card.component';

@Component({
  selector: 'pl-plans-dashboard',
  imports: [AsyncPipe, PlanCardComponent],
  template: `
    <section class="plan-dashboard">
      <h2>Plans</h2>

      @if (plans$ | async; as plans) {
        @if (!plans.length) {
          <p class="empty-state">
            No plans configured yet.
          </p>
        }
        @if (plans.length) {
          <div class="list">
            @for (plan of plans; track plan.id) {
              <pl-plan-card [plan]="plan" />
            }
          </div>
        }
      } @else {
        <p>Loading plans…</p>
      }
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
