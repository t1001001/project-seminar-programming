import { TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Plan } from '../../domain/models/plan.model';

@Component({
  selector: 'pl-plan-card',
  imports: [TitleCasePipe],
  template: `
    <article class="plan-card">
      <header>
        <h3>{{ plan()?.title }}</h3>
        <small>{{ plan()?.difficulty | titlecase }}</small>
      </header>
      <p>{{ plan()?.description || 'No plan description provided.' }}</p>
      <footer>
        Sessions: {{ plan()?.sessionCount }}
      </footer>
    </article>
  `,
  styles: [
    `
      .plan-card {
        border: 1px solid #e2e8f0;
        border-radius: 0.75rem;
        padding: 1rem;
        background: white;
      }
      header {
        display: flex;
        justify-content: space-between;
        margin-bottom: 0.5rem;
        font-weight: 600;
      }
      footer {
        margin-top: 0.5rem;
        font-size: 0.875rem;
        color: #475569;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlanCardComponent {
  plan = input<Plan | null>(null);
}
