import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { AsyncPipe } from '@angular/common';
import { BehaviorSubject, Observable, catchError, map, of, switchMap, tap } from 'rxjs';

import { PlanLogicService } from '../../logic-services/plan-logic.service';
import { TrainingPlan, Session } from '../../provider-services/plan-provider.service';
import { PlanEditDialogComponent } from '../../ui/plan-edit-dialog/plan-edit-dialog';

@Component({
  selector: 'lib-plan-detail',

  imports: [
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatDialogModule,
    AsyncPipe
  ],
  templateUrl: './plan-detail.html',
  styleUrl: './plan-detail.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlanDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly planService = inject(PlanLogicService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly dialog = inject(MatDialog);

  private readonly refreshTrigger$ = new BehaviorSubject<void>(undefined);
  plan$: Observable<TrainingPlan | null> | null = null;
  currentPlan: TrainingPlan | null = null;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.plan$ = this.refreshTrigger$.pipe(
        switchMap(() => this.planService.getPlanById(id)),
        map(plan => ({
          ...plan,
          sessions: this.normalizeSessions(plan.sessions)
        })),
        tap(plan => {
          this.currentPlan = plan;
        }),
        catchError((err) => {
          this.snackBar.open(err.message, 'Close', {
            duration: 5000,
            panelClass: ['error-snackbar']
          });
          this.router.navigate(['/plans']);
          return of(null);
        })
      );
    }
  }

  onBack(): void {
    this.router.navigate(['/plans']);
  }

  openEditDialog(plan: TrainingPlan): void {
    const dialogRef = this.dialog.open(PlanEditDialogComponent, {
      width: '820px',
      maxWidth: '96vw',
      panelClass: 'custom-dialog-container',
      data: { plan }
    });

    dialogRef.afterClosed().subscribe((updated: boolean) => {
      if (updated) {
        this.refreshTrigger$.next();
        this.snackBar.open('Training plan updated successfully!', 'Close', {
          duration: 3000,
          panelClass: ['success-snackbar']
        });
      }
    });
  }

  private normalizeSessions(sessions?: Session[] | null): Session[] {
    if (!sessions?.length) {
      return [];
    }

    return [...sessions]
      .sort((a, b) => (a.orderID ?? 0) - (b.orderID ?? 0))
      .map((session, idx) => ({
        ...session,
        orderID: session.orderID ?? idx + 1,
      }));
  }
}
