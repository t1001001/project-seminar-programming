import { ChangeDetectionStrategy, Component, ElementRef, ViewChild, inject } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';

import { DragDropModule, CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { take, catchError, of, tap } from 'rxjs';

import {
  SessionLogicService,
  SessionCreatePayload,
  SessionDetail,
  SessionExerciseDetail,
  SessionUpdatePayload
} from '../../logic-services/session-logic.service';
import { Exercise } from 'exercises-lib';
import { PlanSummary } from '../../provider-services/session-provider.service';

export interface SessionEditDialogData {
  session?: SessionDetail;
}

@Component({
  selector: 'lib-session-edit-dialog',
  imports: [
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule,
    DragDropModule,
  ],
  templateUrl: './session-edit-dialog.html',
  styleUrl: './session-edit-dialog.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SessionEditDialogComponent {
  private readonly dialogRef = inject(MatDialogRef<SessionEditDialogComponent>);
  private readonly dialogData = inject<SessionEditDialogData | null>(MAT_DIALOG_DATA, { optional: true });
  private readonly fb = inject(FormBuilder);
  private readonly sessionService = inject(SessionLogicService);
  private readonly snackBar = inject(MatSnackBar);

  private sessionId: string | null = null;
  private prefilledExercises: SessionExerciseDetail[] = [];

  plans: PlanSummary[] = [];
  exercises: Exercise[] = [];
  isSaving = false;
  showAddForm = false;
  private isInitializingPosition = false;

  @ViewChild('addFormRef') addFormRef?: ElementRef<HTMLElement>;

  readonly sessionForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    planId: ['', [Validators.required]],
    orderID: [null, [Validators.required, Validators.min(1), Validators.max(30)]],
  });

  readonly addExerciseForm: FormGroup = this.fb.group({
    exerciseId: ['', Validators.required],
    plannedSets: [null, [Validators.required, Validators.min(1)]],
    plannedReps: [null, [Validators.required, Validators.min(1)]],
    plannedWeight: [null, [Validators.required, Validators.min(0)]],
  });

  readonly exercisesArray: FormArray = this.fb.array([]);

  constructor() {
    if (this.dialogData?.session) {
      this.sessionId = this.dialogData.session.id;
      this.prefilledExercises = this.dialogData.session.exercises;
      this.populateFromSession(this.dialogData.session);
    }

    this.sessionService.getAllExercises()
      .pipe(
        take(1),
        tap((list) => this.exercises = list),
        catchError((err) => {
          this.snackBar.open('Failed to load exercises', 'Close', {
            duration: 4000,
            panelClass: ['error-snackbar']
          });
          return of([] as Exercise[]);
        })
      )
      .subscribe(() => {
        if (this.isEditMode() && this.dialogData?.session) {
          this.populateFromSession(this.dialogData.session);
        }
      });

    // Fetch plans to allow creating sessions directly
    this.sessionService.getPlans()
      .pipe(
        take(1),
        tap((plans) => this.plans = plans),
        catchError(() => {
          this.snackBar.open('Failed to load plans', 'Close', {
            duration: 4000,
            panelClass: ['error-snackbar']
          });
          return of([] as PlanSummary[]);
        })
      )
      .subscribe(() => {
        if (this.isEditMode() && this.dialogData?.session) {
          this.populateFromSession(this.dialogData.session);
        }
      });

    this.addExerciseForm.get('exerciseId')?.valueChanges.subscribe((exerciseId) => {
      this.updateAddFormWeightValidator(exerciseId as string | null);
    });

    this.sessionForm.get('planId')?.valueChanges.subscribe((planId) => {
      if (this.isInitializingPosition) return;
      this.prefillPosition(planId as string | null | undefined);
    });
  }

  get exerciseControls(): FormGroup[] {
    return this.exercisesArray.controls as FormGroup[];
  }

  isEditMode(): boolean {
    return !!this.sessionId;
  }

  availableExercises(): Exercise[] {
    const selectedIds = new Set(this.exercisesArray.controls.map(ctrl => ctrl.value.exerciseId));
    return this.exercises.filter(exercise => !selectedIds.has(exercise.id));
  }

  private findExercise(exerciseId: string | null | undefined): Exercise | undefined {
    return this.exercises.find(ex => ex.id === exerciseId);
  }

  private populateFromSession(session: SessionDetail): void {
    this.isInitializingPosition = true;
    this.sessionForm.patchValue({
      name: session.name,
      planId: session.planId ?? '',
      orderID: session.orderID ?? null,
    });
    this.isInitializingPosition = false;

    this.exercisesArray.clear();
    (session.exercises || []).forEach((exercise, idx) => {
      this.exercisesArray.push(this.buildExerciseGroup(exercise, idx));
    });
    this.updateOrderNumbers();
  }

  private buildExerciseGroup(exercise: Partial<SessionExerciseDetail>, index: number): FormGroup {
    const category = this.getExerciseCategory(exercise.exerciseId || exercise.id || '') as Exercise['category'];
    const isBodyWeight = category === 'BodyWeight';
    const weightValidators = this.getWeightValidators(category);
    const initialWeight = exercise.plannedWeight ?? null;

    return this.fb.group({
      executionId: [(exercise as SessionExerciseDetail).id || null],
      exerciseId: [exercise.exerciseId, Validators.required],
      plannedSets: [exercise.plannedSets ?? 0, [Validators.required, Validators.min(1)]],
      plannedReps: [exercise.plannedReps ?? 0, [Validators.required, Validators.min(1)]],
      plannedWeight: [
        initialWeight,
        weightValidators
      ],
      orderID: [exercise.orderID ?? index + 1],
    });
  }

  onAddExercise(): void {
    if (this.addExerciseForm.invalid) {
      this.addExerciseForm.markAllAsTouched();
      return;
    }

    const value = this.addExerciseForm.value;
    const exerciseId = value.exerciseId as string;
    const existing = this.exercisesArray.controls.some(ctrl => ctrl.value.exerciseId === exerciseId);
    if (existing) {
      this.snackBar.open('This exercise is already in the session', 'Close', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
      return;
    }

    const exercise = this.findExercise(exerciseId);
    const plannedSets = Number(value.plannedSets);
    const plannedReps = Number(value.plannedReps);
    const plannedWeight = Number(value.plannedWeight);

    if (plannedSets <= 0 || plannedReps <= 0) {
      this.snackBar.open('Sets and reps must be greater than 0', 'Close', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
      return;
    }

    const category = this.getExerciseCategory(exerciseId);
    const isBodyWeight = category === 'BodyWeight';
    if (plannedWeight < 0) {
      this.snackBar.open('Weight cannot be negative', 'Close', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
      return;
    }

    if (!isBodyWeight && plannedWeight <= 0) {
      this.snackBar.open('Weight must be greater than 0 for this exercise', 'Close', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
      return;
    }

    const group = this.buildExerciseGroup({
      exerciseId,
      plannedSets,
      plannedReps,
      plannedWeight,
      orderID: this.exercisesArray.length + 1,
      category: exercise?.category,
    }, this.exercisesArray.length);

    this.exercisesArray.push(group);
    this.sessionForm.markAsDirty();
    this.addExerciseForm.patchValue({
      exerciseId: '',
      plannedSets: null,
      plannedReps: null,
      plannedWeight: null,
    });
    this.showAddForm = false;
  }

  onReorder(event: CdkDragDrop<FormGroup[]>): void {
    moveItemInArray(this.exercisesArray.controls, event.previousIndex, event.currentIndex);
    this.updateOrderNumbers();
    this.sessionForm.markAsDirty();
  }

  private updateOrderNumbers(): void {
    this.exercisesArray.controls.forEach((ctrl, idx) => {
      ctrl.get('orderID')?.setValue(idx + 1);
    });
  }

  removeExercise(index: number): void {
    this.exercisesArray.removeAt(index);
    this.updateOrderNumbers();
    this.sessionForm.markAsDirty();
  }

  getExerciseName(exerciseId: string | null | undefined): string {
    if (!exerciseId) return 'Exercise';

    const fromLibrary = this.findExercise(exerciseId)?.name;
    if (fromLibrary) return fromLibrary;

    const fromSession = this.prefilledExercises.find(ex => ex.exerciseId === exerciseId);
    if (fromSession?.exerciseName) return fromSession.exerciseName;

    return 'Exercise';
  }

  getExerciseCategory(exerciseId: string): string {
    const fromLibrary = this.findExercise(exerciseId)?.category;
    if (fromLibrary) return fromLibrary;

    const fromSession = this.prefilledExercises.find(ex => ex.exerciseId === exerciseId);
    if (fromSession?.category) return fromSession.category;

    return 'Unspecified';
  }

  getWeightHint(exerciseId: string | null | undefined): string {
    const category = this.getExerciseCategory(exerciseId || '');
    if (category === 'BodyWeight') {
      return 'Can be >=0 for this exercise';
    }
    return 'Must be >0 for this exercise';
  }

  getAddFormWeightHint(): string {
    const selectedId = this.addExerciseForm.get('exerciseId')?.value as string | null;
    if (!selectedId) {
      return 'Select an exercise to see guidance';
    }
    return this.getWeightHint(selectedId);
  }

  requiresPositiveWeight(exerciseId: string | null | undefined): boolean {
    if (!exerciseId) return false;
    return this.getExerciseCategory(exerciseId || '') !== 'BodyWeight';
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onToggleAddForm(): void {
    this.showAddForm = !this.showAddForm;
    if (this.showAddForm) {
      setTimeout(() => {
        this.addFormRef?.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 0);
    }
  }

  onSave(): void {
    if (this.sessionForm.invalid) {
      this.sessionForm.markAllAsTouched();
      return;
    }

    if (!this.exercisesArray.length) {
      this.snackBar.open('Please add at least one exercise to the session', 'Close', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
      return;
    }

    const exerciseIds = new Set<string>();
    for (const ctrl of this.exercisesArray.controls) {
      const id = ctrl.value.exerciseId;
      if (exerciseIds.has(id)) {
        this.snackBar.open('Each exercise can only be added once per session', 'Close', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
        return;
      }
      exerciseIds.add(id);
    }

    const formValue = this.sessionForm.value;
    const position = Number(formValue.orderID);
    const positionText = Number.isFinite(position) ? position : formValue.orderID;
    const payload: SessionCreatePayload | SessionUpdatePayload = {
      name: formValue.name?.trim() || '',
      planId: formValue.planId,
      orderID: Number(formValue.orderID),
      exercises: this.exercisesArray.controls.map((ctrl, idx) => ({
        id: ctrl.value.executionId || undefined,
        exerciseId: ctrl.value.exerciseId,
        plannedSets: Number(ctrl.value.plannedSets),
        plannedReps: Number(ctrl.value.plannedReps),
        plannedWeight: Number(ctrl.value.plannedWeight),
        orderID: Number(ctrl.value.orderID ?? idx + 1),
        category: this.getExerciseCategory(ctrl.value.exerciseId) as Exercise['category'],
      })),
    };

    this.isSaving = true;
    const save$ = this.isEditMode() && this.sessionId
      ? this.sessionService.updateSessionWithExercises(this.sessionId, payload as SessionUpdatePayload)
      : this.sessionService.createSessionWithExercises(payload as SessionCreatePayload);

    save$.subscribe({
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
          : rawMessage || 'Failed to save session';
        this.snackBar.open(message, 'Close', {
          duration: 5000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  private getWeightValidators(category: Exercise['category'] | string) {
    const minWeight = category === 'BodyWeight' ? 0 : 1;
    return [Validators.required, Validators.min(minWeight)];
  }

  private prefillPosition(planId: string | null | undefined): void {
    const positionControl = this.sessionForm.get('orderID');
    if (!positionControl) return;

    if (!planId) {
      positionControl.setValue(null);
      return;
    }

    this.sessionService.getNextAvailablePosition(planId, this.sessionId ?? undefined)
      .pipe(take(1))
      .subscribe({
        next: (nextPosition) => {
          if (this.sessionForm.get('planId')?.value !== planId) return;
          positionControl.setValue(nextPosition ?? null, { emitEvent: false });
        },
        error: () => {
          if (this.sessionForm.get('planId')?.value !== planId) return;
          positionControl.setValue(null, { emitEvent: false });
        }
      });
  }

  private updateAddFormWeightValidator(exerciseId: string | null): void {
    const weightControl = this.addExerciseForm.get('plannedWeight');
    if (!weightControl) return;

    if (!exerciseId) {
      weightControl.setValidators([Validators.required, Validators.min(0)]);
      weightControl.updateValueAndValidity({ emitEvent: false });
      return;
    }

    const category = this.getExerciseCategory(exerciseId || '');
    const validators = this.getWeightValidators(category);
    weightControl.setValidators(validators);

    weightControl.updateValueAndValidity({ emitEvent: false });
  }
}
