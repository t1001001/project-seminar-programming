import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { DragDropModule, CdkDragDrop } from '@angular/cdk/drag-drop';
import { forkJoin, of, switchMap, Observable } from 'rxjs';

import { PlanLogicService } from '../../logic-services/plan-logic.service';
import { TrainingPlan, TrainingPlanUpdate, Session } from '../../provider-services/plan-provider.service';
import { SessionLogicService } from 'sessions-lib';

export interface PlanEditDialogData {
  plan: TrainingPlan;
}

@Component({
  selector: 'lib-plan-edit-dialog',
  imports: [
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    ReactiveFormsModule,
    DragDropModule
  ],
  templateUrl: './plan-edit-dialog.html',
  styleUrl: './plan-edit-dialog.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlanEditDialogComponent implements OnInit {
  private readonly dialogRef = inject(MatDialogRef<PlanEditDialogComponent>);
  private readonly dialogData = inject<PlanEditDialogData>(MAT_DIALOG_DATA);
  private readonly fb = inject(FormBuilder);
  private readonly planService = inject(PlanLogicService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly sessionService = inject(SessionLogicService);

  readonly form: FormGroup = this.fb.group({
    name: [this.dialogData.plan?.name ?? '', [Validators.required, Validators.minLength(2)]],
    description: [this.dialogData.plan?.description ?? '']
  });

  private readonly initialSessionsSnapshot: Session[] = this.normalizeSessions(this.dialogData.plan?.sessions);
  private initialName = this.dialogData.plan?.name ?? '';
  private initialDescription = this.dialogData.plan?.description ?? '';
  sessions: Session[] = this.normalizeSessions(this.dialogData.plan?.sessions);
  isSaving = false;
  isDirty = false;

  onCancel(): void {
    this.dialogRef.close(false);
  }

  ngOnInit(): void {
    this.form.valueChanges.subscribe(() => this.updateDirtyFlag());
    this.updateDirtyFlag();
  }

  onReorderSessions(event: CdkDragDrop<Session[]>): void {
    if (event.previousIndex === event.currentIndex) return;

    const updated = [...this.sessions];
    const [moved] = updated.splice(event.previousIndex, 1);
    if (!moved) return;

    updated.splice(event.currentIndex, 0, moved);
    this.sessions = updated.map((session, idx) => ({
      ...session,
      orderID: idx + 1
    }));
    this.updateDirtyFlag();
  }

  onSave(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.value;
    const normalized = this.normalizeSessions(this.sessions);
    const payload: TrainingPlanUpdate = {
      name: (value.name as string).trim(),
      description: value.description ?? '',
      sessions: normalized.map(session => session.id!).filter((id): id is string => !!id)
    };

    if (!payload.name) {
      this.snackBar.open('Name is required', 'Close', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
      return;
    }

    this.isSaving = true;
    const orderUpdates = this.getOrderUpdates();
    const bufferBase = Math.max(0, ...this.sessions.map(s => s.orderID ?? 0)) + orderUpdates.length + 5;

    const moveToTemp$: Observable<unknown> = orderUpdates.length
      ? forkJoin(orderUpdates.map((update, idx) =>
        this.sessionService.updateSession(update.id, {
          name: update.name,
          planId: update.planId,
          orderID: bufferBase + idx,
          scheduledDate: update.scheduledDate,
          status: update.status
        } as any)
      ))
      : of(null);

    const applyFinal$: Observable<unknown> = orderUpdates.length
      ? forkJoin(orderUpdates.map(update =>
        this.sessionService.updateSession(update.id, {
          name: update.name,
          planId: update.planId,
          orderID: update.orderID,
          scheduledDate: update.scheduledDate,
          status: update.status
        } as any)
      ))
      : of(null);

    moveToTemp$
      .pipe(
        switchMap(() => applyFinal$),
        switchMap(() => this.planService.updatePlan(this.dialogData.plan.id, payload))
      )
      .subscribe({
        next: () => {
          this.isSaving = false;
          this.initialName = payload.name;
          this.initialDescription = payload.description ?? '';
          this.resetInitialSessions();
          this.updateDirtyFlag();
          this.dialogRef.close(true);
        },
        error: (err: any) => {
          this.isSaving = false;
          this.snackBar.open(err?.message || 'Failed to update plan', 'Close', {
            duration: 5000,
            panelClass: ['error-snackbar']
          });
        }
      });
  }

  private updateDirtyFlag(): void {
    const currentName = (this.form.get('name')?.value as string ?? '').trim();
    const currentDescription = this.form.get('description')?.value ?? '';
    const nameChanged = currentName !== this.initialName;
    const descChanged = (currentDescription ?? '') !== this.initialDescription;

    const currentOrders = this.sessions.map(s => `${s.id}:${s.orderID ?? ''}`).join('|');
    const initialOrders = this.initialSessionsSnapshot.map(s => `${s.id}:${s.orderID ?? ''}`).join('|');
    const orderChanged = currentOrders !== initialOrders;

    this.isDirty = nameChanged || descChanged || orderChanged;
  }

  private getOrderUpdates(): Array<{ id: string; orderID: number; name: string; planId: string; scheduledDate?: string; status?: Session['status'] }> {
    const initialOrders = new Map(
      this.initialSessionsSnapshot
        .filter(session => session.id)
        .map(session => [session.id!, session.orderID ?? null])
    );

    return this.sessions
      .filter(session => session.id)
      .map((session, idx) => ({
        id: session.id!,
        orderID: session.orderID ?? idx + 1,
        name: session.name,
        planId: session.planId ?? this.dialogData.plan.id,
        scheduledDate: session.scheduledDate,
        status: session.status
      }))
      .filter(update => initialOrders.get(update.id) !== update.orderID);
  }

  private resetInitialSessions(): void {
    this.initialSessionsSnapshot.length = 0;
    this.initialSessionsSnapshot.push(...this.normalizeSessions(this.sessions));
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
