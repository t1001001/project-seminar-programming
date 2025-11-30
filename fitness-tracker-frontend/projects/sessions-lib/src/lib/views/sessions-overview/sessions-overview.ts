import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgFor, NgIf } from '@angular/common';
import { BehaviorSubject, debounceTime, shareReplay, startWith, switchMap, tap, catchError, of } from 'rxjs';

import { SessionLogicService, SessionOverview } from '../../logic-services/session-logic.service';
import { SessionCardComponent } from '../../ui/session-card/session-card';

@Component({
  selector: 'lib-sessions-overview',
  standalone: true,
  imports: [
    MatIconModule,
    MatButtonModule,
    ReactiveFormsModule,
    NgFor,
    NgIf,
    SessionCardComponent
  ],
  templateUrl: './sessions-overview.html',
  styleUrl: './sessions-overview.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SessionsOverviewComponent {
  private readonly sessionService = inject(SessionLogicService);
  private readonly snackBar = inject(MatSnackBar);

  readonly searchControl = new FormControl('');
  private readonly refreshTrigger$ = new BehaviorSubject<void>(undefined);

  private readonly sessions = toSignal(
    this.refreshTrigger$.pipe(
      switchMap(() => this.sessionService.getAllSessions().pipe(
        catchError((err) => {
          this.snackBar.open(err.message, 'Close', {
            duration: 4000,
            panelClass: ['error-snackbar']
          });
          return of([] as SessionOverview[]);
        })
      )),
      tap(() => { }),
      shareReplay(1)
    ),
    { initialValue: [] as SessionOverview[] }
  );

  private readonly searchTerm = toSignal(
    this.searchControl.valueChanges.pipe(startWith(''), debounceTime(200)),
    { initialValue: '' }
  );

  readonly filteredSessions = computed(() => {
    const sessions = this.sessions();
    if (!sessions) return undefined;

    const term = (this.searchTerm() || '').toLowerCase();
    return sessions.filter(session =>
      session.name.toLowerCase().includes(term) ||
      (session.planName?.toLowerCase() || '').includes(term)
    );
  });

  readonly totalSessionsCount = computed(() => this.sessions()?.length ?? 0);
  readonly totalCompletedCount = computed(() =>
    (this.sessions() || []).reduce((sum, session) => sum + (session.sessionLogCount ?? 0), 0)
  );

  onCreate(): void {
    this.snackBar.open('Session creation coming soon', 'Close', {
      duration: 2500,
      panelClass: ['info-snackbar']
    });
  }

  refresh(): void {
    this.refreshTrigger$.next();
  }
}
