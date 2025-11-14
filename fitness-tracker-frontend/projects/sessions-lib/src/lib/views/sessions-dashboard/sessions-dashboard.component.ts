import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Session } from '../../domain/models/session.model';
import { SessionManagerService } from '../../services/business/session-manager.service';
import { SessionCardComponent } from '../../ui/session-card/session-card.component';

@Component({
  selector: 'ss-sessions-dashboard',
  imports: [AsyncPipe, SessionCardComponent],
  template: `
    <section class="session-dashboard">
      <h2>Sessions</h2>

      @if (sessions$ | async; as sessions) {
        @if (!sessions.length) {
          <p class="empty-state">
            No sessions scheduled.
          </p>
        }
        @if (sessions.length) {
          <div class="list">
            @for (session of sessions; track session.id) {
              <ss-session-card [session]="session" />
            }
          </div>
        }
      } @else {
        <p>Loading sessions…</p>
      }
    </section>
  `,
  styles: [
    `
      .session-dashboard {
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
export class SessionsDashboardComponent {
  private readonly sessionManager = inject(SessionManagerService);
  readonly sessions$: Observable<Session[]> = this.sessionManager.loadSessions();
}
