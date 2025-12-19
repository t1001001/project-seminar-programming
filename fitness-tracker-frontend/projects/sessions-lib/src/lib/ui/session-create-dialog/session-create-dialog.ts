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
import { showError } from '../../shared';
import { MIN_NAME_LENGTH } from '../../shared/session.constants';

@Component({
  selector: 'lib-session-create-dialog',
  imports: [MatDialogModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule, ReactiveFormsModule],
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
    name: ['', [Validators.required, Validators.minLength(MIN_NAME_LENGTH)]],
    planId: ['', [Validators.required]],
    orderID: [null],
  });

  constructor() {
    this.loadPlans();
    this.setupPlanChangeSubscription();
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (!this.validateForm()) return;
    this.saveSession();
  }

  private loadPlans(): void {
    this.sessionService.getPlans().pipe(
      take(1),
      tap(plans => this.plans = plans),
      catchError(() => {
        showError(this.snackBar, 'Failed to load plans');
        return of([] as PlanSummary[]);
      })
    ).subscribe();
  }

  private setupPlanChangeSubscription(): void {
    this.form.get('planId')?.valueChanges.subscribe((planId) => {
      this.prefillPosition(planId as string | null);
    });
  }

  private validateForm(): boolean {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return false;
    }
    return true;
  }

  private saveSession(): void {
    this.isSaving = true;
    const payload = this.buildPayload();
    this.sessionService.createSession(payload).subscribe({
      next: () => this.handleSuccess(),
      error: (err) => this.handleError(err)
    });
  }

  private buildPayload() {
    const value = this.form.value;
    return {
      name: value.name,
      planId: value.planId,
      orderID: Number(value.orderID),
    };
  }

  private handleSuccess(): void {
    this.isSaving = false;
    this.dialogRef.close(true);
  }

  private handleError(err: any): void {
    this.isSaving = false;
    const message = err?.message || 'Failed to create session';
    showError(this.snackBar, message);
  }

  private prefillPosition(planId: string | null): void {
    const positionControl = this.form.get('orderID');
    if (!positionControl || !planId) {
      positionControl?.setValue(null);
      return;
    }

    this.sessionService.getNextAvailablePosition(planId)
      .pipe(take(1))
      .subscribe({
        next: (nextPosition) => {
          if (this.form.get('planId')?.value === planId) {
            positionControl.setValue(nextPosition ?? null, { emitEvent: false });
          }
        },
        error: () => positionControl.setValue(null, { emitEvent: false })
      });
  }
}

