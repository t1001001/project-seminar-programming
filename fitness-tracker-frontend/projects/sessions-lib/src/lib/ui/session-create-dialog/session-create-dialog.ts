import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';

import { catchError, of, take, tap } from 'rxjs';

import { SessionLogicService } from '../../logic-services/session-logic.service';
import { PlanSummary } from '../../provider-services/session-provider.service';

@Component({
  selector: 'lib-session-create-dialog',
  imports: [
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './session-create-dialog.html',
  styleUrl: './session-create-dialog.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SessionCreateDialogComponent {
  private readonly dialogRef = inject(MatDialogRef<SessionCreateDialogComponent>);
  private readonly fb = inject(FormBuilder);
  private readonly sessionService = inject(SessionLogicService);
  private readonly snackBar = inject(MatSnackBar);

  plans: PlanSummary[] = [];
  isSaving = false;

  readonly form: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    planId: ['', [Validators.required]],
    orderID: [null, [Validators.min(1), Validators.max(30)]],
  });

  constructor() {
    this.sessionService.getPlans()
      .pipe(
        take(1),
        tap(plans => this.plans = plans),
        catchError(() => {
          this.snackBar.open('Failed to load plans', 'Close', {
            duration: 4000,
            panelClass: ['error-snackbar']
          });
          return of([] as PlanSummary[]);
        })
      )
      .subscribe();

    this.form.get('planId')?.valueChanges.subscribe((planId) => {
      this.prefillPosition(planId as string | null | undefined);
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSaving = true;
    const value = this.form.value;
    const position = Number(value.orderID);
    const positionText = Number.isFinite(position) ? position : value.orderID;
    this.sessionService.createSession({
      name: value.name,
      planId: value.planId,
      orderID: Number(value.orderID),
    }).subscribe({
      next: () => {
        this.isSaving = false;
        this.dialogRef.close(true);
      },
      error: (err) => {
        this.isSaving = false;
        const rawMessage = typeof err?.error === 'string'
          ? err.error
          : typeof err?.error?.message === 'string'
            ? err.error.message
            : typeof err?.message === 'string'
              ? err.message
              : '';
        const normalized = rawMessage ? rawMessage.toLowerCase() : '';
        const isOrderConflict = err?.status === 409
          || normalized.includes('order')
          || normalized.includes('position')
          || normalized.includes('already exists');
        const conflictMessage = rawMessage
          || (positionText ? `A session with position ${positionText} already exists in this plan.` : '');
        const message = isOrderConflict
          ? conflictMessage || 'A session with this position already exists in this plan.'
          : rawMessage || 'Failed to create session';
        this.snackBar.open(message, 'Close', {
          duration: 5000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  private prefillPosition(planId: string | null | undefined): void {
    const positionControl = this.form.get('orderID');
    if (!positionControl) return;

    if (!planId) {
      positionControl.setValue(null);
      return;
    }

    this.sessionService.getNextAvailablePosition(planId)
      .pipe(take(1))
      .subscribe({
        next: (nextPosition) => {
          if (this.form.get('planId')?.value !== planId) return;
          positionControl.setValue(nextPosition ?? null, { emitEvent: false });
        },
        error: () => {
          if (this.form.get('planId')?.value !== planId) return;
          positionControl.setValue(null, { emitEvent: false });
        }
      });
  }
}
