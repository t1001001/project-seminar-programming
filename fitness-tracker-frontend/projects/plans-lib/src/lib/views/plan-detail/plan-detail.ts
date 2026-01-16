import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';

import { PlanLogicService } from '../../logic-services/plan-logic.service';
import { TrainingPlan, Session } from '../../provider-services/plan-provider.service';
import { PlanEditDialogComponent } from '../../ui/plan-edit-dialog/plan-edit-dialog';
import { showError, showSuccess } from '../../shared';

import { AuthService } from 'common-lib';

@Component({
  selector: 'lib-plan-detail',

  imports: [
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatDialogModule,
  ],
  templateUrl: './plan-detail.html',
  styleUrl: './plan-detail.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class PlanDetailComponent implements OnInit {
  private readonly location = inject(Location);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly planService = inject(PlanLogicService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly dialog = inject(MatDialog);
  public readonly authService = inject(AuthService);

  private planId: string | null = null;
  readonly plan = signal<TrainingPlan | null>(null);

  ngOnInit(): void {
    this.planId = this.route.snapshot.paramMap.get('id');
    if (this.planId) {
      this.loadPlan(this.planId);
    }
  }

  onBack(): void {
    this.location.back();
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
        this.refresh();
        showSuccess(this.snackBar, 'Training plan updated successfully!');
      }
    });
  }

  refresh(): void {
    if (this.planId) {
      this.loadPlan(this.planId);
    }
  }

  navigateToSession(session: Session): void {
    if (session.id) {
      this.router.navigate(['/sessions', String(session.id)]);
    }
  }

  private loadPlan(id: string): void {
    this.planService.getPlanById(id).subscribe({
      next: (plan) => {
        const normalizedPlan = {
          ...plan,
          sessions: this.normalizeSessions(plan.sessions)
        };
        this.plan.set(normalizedPlan);
      },
      error: (err) => {
        showError(this.snackBar, err.message);
        this.router.navigate(['/plans']);
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

