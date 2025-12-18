import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, debounceTime, shareReplay, startWith, switchMap, catchError, of } from 'rxjs';

import { SessionLogicService, SessionOverview } from '../../logic-services/session-logic.service';
import { SessionCardComponent } from '../../ui/session-card/session-card';
import { SessionDeleteDialogComponent } from '../../ui/session-delete-dialog/session-delete-dialog';
import { SessionCreateDialogComponent } from '../../ui/session-create-dialog/session-create-dialog';
import { showError, showSuccess } from '../../shared';

@Component({
  selector: 'lib-sessions-overview',
  imports: [
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    ReactiveFormsModule,
    SessionCardComponent,
  ],
  templateUrl: './sessions-overview.html',
  styleUrl: './sessions-overview.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
/**
 * Component for displaying a list of all training sessions.
 * Supports filtration, creation, and deletion of sessions.
 */
export class SessionsOverviewComponent {
  private readonly sessionService = inject(SessionLogicService);
  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);

  /** Control for filtering sessions by name or plan. */
  readonly searchControl = new FormControl('');
  /** Trigger to manually refresh the session list. */
  private readonly refreshTrigger$ = new BehaviorSubject<void>(undefined);

  /** Signal holding all sessions, automatically refreshed on trigger. */
  private readonly sessions = toSignal(
    this.refreshTrigger$.pipe(
      switchMap(() => this.sessionService.getAllSessions().pipe(
        catchError((err) => {
          showError(this.snackBar, err.message);
          return of([] as SessionOverview[]);
        })
      )),
      shareReplay(1)
    ),
    { initialValue: [] as SessionOverview[] }
  );

  /** Signal holding the current search term, debounced. */
  private readonly searchTerm = toSignal(
    this.searchControl.valueChanges.pipe(startWith(''), debounceTime(200)),
    { initialValue: '' }
  );

  /**
   * Filtered list of sessions based on search term.
   * Matches against session name and associated plan name.
   */
  readonly filteredSessions = computed(() => {
    const sessions = this.sessions();
    if (!sessions) return undefined;

    const term = (this.searchTerm() || '').toLowerCase();
    return sessions.filter(session =>
      session.name.toLowerCase().includes(term) ||
      (session.planName?.toLowerCase() || '').includes(term)
    );
  });

  /** Total count of available sessions. */
  readonly totalSessionsCount = computed(() => this.sessions()?.length ?? 0);
  /** Total count of completed sessions (based on logs). */
  readonly totalCompletedCount = computed(() =>
    (this.sessions() || []).reduce((sum, session) => sum + (session.sessionLogCount ?? 0), 0)
  );

  // ==========================================================================
  // Event Handlers
  // ==========================================================================

  /**
   * Opens the dialog to create a new session.
   * Refreshes the list on successful creation.
   */
  onCreate(): void {
    const dialogRef = this.dialog.open(SessionCreateDialogComponent, {
      width: '500px',
      maxWidth: '96vw',
      panelClass: 'custom-dialog-container',
    });

    dialogRef.afterClosed().subscribe((created: boolean) => {
      if (created) {
        this.refresh();
        showSuccess(this.snackBar, 'Session created successfully!');
      }
    });
  }

  /**
   * Opens a confirmation dialog to delete a session.
   * Proceeds with deletion if confirmed.
   */
  onDelete(session: SessionOverview): void {
    const dialogRef = this.dialog.open(SessionDeleteDialogComponent, {
      data: { sessionName: session.name },
      panelClass: 'custom-dialog-container',
    });

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.deleteSession(session);
      }
    });
  }

  /** Requests a reload of the sessions list. */
  refresh(): void {
    this.refreshTrigger$.next();
  }

  // ==========================================================================
  // Private Methods
  // ==========================================================================

  private deleteSession(session: SessionOverview): void {
    this.sessionService.deleteSession(session.id).subscribe({
      next: () => {
        this.refresh();
        showSuccess(this.snackBar, 'Session deleted successfully!');
      },
      error: (err) => showError(this.snackBar, err.message)
    });
  }
}
