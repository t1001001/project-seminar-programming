import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Session } from '../../domain/models/session.model';

@Component({
  selector: 'ss-session-card',
  imports: [DatePipe],
  template: `
    <article class="session-card" [class.session-card--completed]="session()?.completed">
      <header>
        <h3>Session {{ session()?.id }}</h3>
        <small>{{ session()?.scheduledAt | date: 'medium' }}</small>
      </header>
      <p>{{ session()?.notes || 'No session notes yet.' }}</p>
      <footer>
        Status: {{ session()?.completed ? 'Completed' : 'Scheduled' }}
      </footer>
    </article>
  `,
  styles: [
    `
      .session-card {
        border: 1px solid #e2e8f0;
        border-radius: 0.75rem;
        padding: 1rem;
        background: white;
      }
      .session-card--completed {
        border-color: #22c55e;
      }
      header {
        display: flex;
        justify-content: space-between;
        margin-bottom: 0.5rem;
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
export class SessionCardComponent {
  session = input<Session | null>(null);
}
