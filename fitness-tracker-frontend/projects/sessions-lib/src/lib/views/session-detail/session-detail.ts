import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { AsyncPipe } from '@angular/common';
import { BehaviorSubject, Observable, catchError, of, switchMap } from 'rxjs';

import { SessionDetail, SessionLogicService } from '../../logic-services/session-logic.service';
import { SessionFormDialogComponent } from '../../ui/session-form-dialog/session-form-dialog';

@Component({
  selector: 'lib-session-detail',
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatDialogModule,
    AsyncPipe,
  ],
  templateUrl: './session-detail.html',
  styleUrl: './session-detail.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SessionDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly sessionService = inject(SessionLogicService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly dialog = inject(MatDialog);

  private readonly refreshTrigger$ = new BehaviorSubject<void>(undefined);
  session$: Observable<SessionDetail | null> | null = null;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.session$ = this.refreshTrigger$.pipe(
        switchMap(() => this.sessionService.getSessionDetail(id)),
        catchError((err) => {
          this.snackBar.open(err.message, 'Close', {
            duration: 5000,
            panelClass: ['error-snackbar']
          });
          this.router.navigate(['/sessions']);
          return of(null);
        })
      );
    } else {
      this.router.navigate(['/sessions']);
    }
  }

  onBack(): void {
    this.router.navigate(['/sessions']);
  }

  onEdit(session: SessionDetail): void {
    const dialogRef = this.dialog.open(SessionFormDialogComponent, {
      width: '900px',
      maxWidth: '96vw',
      panelClass: 'custom-dialog-container',
      data: { session }
    });

    dialogRef.afterClosed().subscribe((updated: boolean) => {
      if (updated) {
        this.refresh();
        this.snackBar.open('Session updated successfully!', 'Close', {
          duration: 3000,
          panelClass: ['success-snackbar']
        });
      }
    });
  }

  refresh(): void {
    this.refreshTrigger$.next();
  }
}
