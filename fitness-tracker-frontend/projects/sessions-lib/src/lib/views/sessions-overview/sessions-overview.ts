import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, debounceTime, shareReplay, startWith, switchMap, tap, catchError, of } from 'rxjs';

import { SessionLogicService, SessionOverview } from '../../logic-services/session-logic.service';
import { SessionCardComponent } from '../../ui/session-card/session-card';
import { SessionDeleteDialogComponent } from '../../ui/session-delete-dialog/session-delete-dialog';
import { SessionCreateDialogComponent } from '../../ui/session-create-dialog/session-create-dialog';

@Component({
  selector: 'lib-sessions-overview',
  standalone: true,
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
export class SessionsOverviewComponent {
  private readonly sessionService = inject(SessionLogicService);
  private readonly dialog = inject(MatDialog);
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
    const dialogRef = this.dialog.open(SessionCreateDialogComponent, {
      width: '500px',
      maxWidth: '96vw',
      panelClass: 'custom-dialog-container',
    });

    dialogRef.afterClosed().subscribe((created: boolean) => {
      if (created) {
        this.refresh();
        this.snackBar.open('Session created successfully!', 'Close', {
          duration: 3000,
          panelClass: ['success-snackbar']
        });
      }
    });
  }

  onDelete(session: SessionOverview): void {
    const dialogRef = this.dialog.open(SessionDeleteDialogComponent, {
      data: { sessionName: session.name },
      panelClass: 'custom-dialog-container',
    });

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.sessionService.deleteSession(session.id).subscribe({
          next: () => {
            this.refresh();
            this.snackBar.open('Session deleted successfully!', 'Close', {
              duration: 3000,
              panelClass: ['success-snackbar']
            });
          },
          error: (err) => {
            this.snackBar.open(err.message, 'Close', {
              duration: 5000,
              panelClass: ['error-snackbar']
            });
          }
        });
      }
    });
  }

  refresh(): void {
    this.refreshTrigger$.next();
  }
}
