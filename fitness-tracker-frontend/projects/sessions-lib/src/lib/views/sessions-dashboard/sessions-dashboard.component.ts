import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Session } from '../../domain/models/session.model';
import { SessionManagerService } from '../../services/business/session-manager.service';
import { SessionCardComponent } from '../../ui/session-card/session-card.component';

@Component({
  selector: 'ss-sessions-dashboard',
  standalone: true,
  imports: [CommonModule, SessionCardComponent],
  template: `
    <section class="session-dashboard">
      <h2>Sessions</h2>

      <ng-container *ngIf="sessions$ | async as sessions; else loading">
        <p *ngIf="!sessions.length" class="empty-state">
          No sessions scheduled.
        </p>
        <div *ngIf="sessions.length" class="list">
          <ss-session-card *ngFor="let session of sessions" [session]="session" />
        </div>
      </ng-container>

      <ng-template #loading>
        <p>Loading sessions…</p>
      </ng-template>
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
