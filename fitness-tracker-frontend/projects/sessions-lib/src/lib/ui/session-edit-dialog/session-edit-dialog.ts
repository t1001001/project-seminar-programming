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
import {
  showError,
  MAX_ORDER_VALUE,
  MIN_NAME_LENGTH,
  buildExerciseFormGroup,
  updateExerciseOrderNumbers,
  isExerciseDuplicate,
  getAvailableExercises,
  validateExerciseInput,
  validateUniqueExerciseIds,
  getWeightValidators
} from '../../shared';

/** Data required to initialize or edit a session. */
export interface SessionEditDialogData {
  session?: SessionDetail;
}

@Component({
  selector: 'lib-session-edit-dialog',
  imports: [
    MatDialogModule, MatFormFieldModule, MatInputModule, MatSelectModule,
    MatButtonModule, MatIconModule, ReactiveFormsModule, DragDropModule,
  ],
  templateUrl: './session-edit-dialog.html',
  styleUrl: './session-edit-dialog.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
/**
 * Dialog for creating or editing a training session with its exercises.
 * Handles complex form logic for exercises, including drag-and-drop reordering.
 */
export class SessionEditDialogComponent {
  private readonly dialogRef = inject(MatDialogRef<SessionEditDialogComponent>);
  private readonly dialogData = inject<SessionEditDialogData | null>(MAT_DIALOG_DATA, { optional: true });
  private readonly fb = inject(FormBuilder);
  private readonly sessionService = inject(SessionLogicService);
  private readonly snackBar = inject(MatSnackBar);

  private sessionId: string | null = null;
  private prefilledExercises: SessionExerciseDetail[] = [];
  private isInitializingPosition = false;

  plans: PlanSummary[] = [];
  exercises: Exercise[] = [];
  isSaving = false;
  /** Toggles visibility of the 'Add Exercise' form. */
  showAddForm = false;

  @ViewChild('addFormRef') addFormRef?: ElementRef<HTMLElement>;

  readonly sessionForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(MIN_NAME_LENGTH)]],
    planId: ['', [Validators.required]],
    orderID: [null, [Validators.required, Validators.min(1), Validators.max(MAX_ORDER_VALUE)]],
  });

  readonly addExerciseForm: FormGroup = this.fb.group({
    exerciseId: ['', Validators.required],
    plannedSets: [null, [Validators.required, Validators.min(1)]],
    plannedReps: [null, [Validators.required, Validators.min(1)]],
    plannedWeight: [null, [Validators.required, Validators.min(0)]],
  });

  readonly exercisesArray: FormArray = this.fb.array([]);

  constructor() {
    this.initializeFromDialogData();
    this.loadExercises();
    this.loadPlans();
    this.setupFormSubscriptions();
  }

  // Public API
  /** Returns FormArray controls cast to FormGroup for template iteration. */
  get exerciseControls(): FormGroup[] { return this.exercisesArray.controls as FormGroup[]; }
  isEditMode(): boolean { return !!this.sessionId; }
  availableExercises(): Exercise[] { return getAvailableExercises(this.exercises, this.exercisesArray); }
  hasAvailableExercises(): boolean { return this.availableExercises().length > 0; }

  getExerciseName(exerciseId: string | null | undefined): string {
    if (!exerciseId) return 'Exercise';
    return this.exercises.find(ex => ex.id === exerciseId)?.name
      ?? this.prefilledExercises.find(ex => ex.exerciseId === exerciseId)?.exerciseName ?? 'Exercise';
  }

  getExerciseCategory(exerciseId: string): string {
    return this.exercises.find(ex => ex.id === exerciseId)?.category
      ?? this.prefilledExercises.find(ex => ex.exerciseId === exerciseId)?.category ?? 'Unspecified';
  }

  getWeightHint(exerciseId: string | null | undefined): string {
    return this.getExerciseCategory(exerciseId || '') === 'BodyWeight'
      ? 'Can be >=0 for this exercise' : 'Must be >0 for this exercise';
  }

  /** Returns guidance text for weight input based on exercise type. */
  getAddFormWeightHint(): string {
    const selectedId = this.addExerciseForm.get('exerciseId')?.value as string | null;
    return selectedId ? this.getWeightHint(selectedId) : 'Select an exercise to see guidance';
  }

  requiresPositiveWeight(exerciseId: string | null | undefined): boolean {
    return !!exerciseId && this.getExerciseCategory(exerciseId) !== 'BodyWeight';
  }

  // Event Handlers
  /** Closes the dialog. */
  onCancel(): void { this.dialogRef.close(); }

  onToggleAddForm(): void {
    this.showAddForm = !this.showAddForm;
    if (this.showAddForm) {
      setTimeout(() => this.addFormRef?.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'center' }), 0);
    }
  }

  /**
   * Handles reordering of exercises via drag-and-drop.
   * Updates the form array and marks form as dirty.
   */
  onReorder(event: CdkDragDrop<FormGroup[]>): void {
    moveItemInArray(this.exercisesArray.controls, event.previousIndex, event.currentIndex);
    updateExerciseOrderNumbers(this.exercisesArray);
    this.sessionForm.markAsDirty();
  }

  removeExercise(index: number): void {
    this.exercisesArray.removeAt(index);
    updateExerciseOrderNumbers(this.exercisesArray);
    this.sessionForm.markAsDirty();
  }

  /**
   * Validates and adds a new exercise to the session list.
   * Checks for duplicates and valid input values.
   */
  onAddExercise(): void {
    if (this.addExerciseForm.invalid) { this.addExerciseForm.markAllAsTouched(); return; }

    const { exerciseId, plannedSets, plannedReps, plannedWeight } = this.addExerciseForm.value;
    if (isExerciseDuplicate(exerciseId, this.exercisesArray)) {
      showError(this.snackBar, 'This exercise is already in the session'); return;
    }

    const validation = validateExerciseInput(
      { plannedSets, plannedReps, plannedWeight, exerciseId },
      this.requiresPositiveWeight(exerciseId)
    );
    if (!validation.valid) { showError(this.snackBar, validation.errorMessage!); return; }

    const exercise = this.exercises.find(ex => ex.id === exerciseId);
    const group = buildExerciseFormGroup(this.fb, {
      exerciseId, plannedSets: Number(plannedSets), plannedReps: Number(plannedReps),
      plannedWeight: Number(plannedWeight), orderID: this.exercisesArray.length + 1,
      category: exercise?.category,
    }, this.exercisesArray.length, (id) => this.getExerciseCategory(id));

    this.exercisesArray.push(group);
    this.sessionForm.markAsDirty();
    this.resetAddExerciseForm();
  }

  /**
   * Saves the session and all its exercises.
   * Determines whether to create or update based on session ID presence.
   */
  onSave(): void {
    if (this.sessionForm.invalid) { this.sessionForm.markAllAsTouched(); return; }

    const uniqueCheck = validateUniqueExerciseIds(this.exercisesArray);
    if (!uniqueCheck.valid) { showError(this.snackBar, uniqueCheck.errorMessage!); return; }

    this.isSaving = true;
    const payload = this.buildPayload();
    const save$ = this.isEditMode() && this.sessionId
      ? this.sessionService.updateSessionWithExercises(this.sessionId, payload as SessionUpdatePayload)
      : this.sessionService.createSessionWithExercises(payload as SessionCreatePayload);

    save$.subscribe({
      next: () => { this.isSaving = false; this.dialogRef.close(true); },
      error: (err) => { this.isSaving = false; showError(this.snackBar, err?.message || 'Failed to save session'); }
    });
  }

  // Initialization
  private initializeFromDialogData(): void {
    if (this.dialogData?.session) {
      this.sessionId = this.dialogData.session.id;
      this.prefilledExercises = this.dialogData.session.exercises;
      this.populateFromSession(this.dialogData.session);
    }
  }

  private loadExercises(): void {
    this.sessionService.getAllExercises().pipe(
      take(1), tap((list) => this.exercises = list),
      catchError(() => { showError(this.snackBar, 'Failed to load exercises'); return of([] as Exercise[]); })
    ).subscribe(() => this.repopulateIfEditMode());
  }

  private loadPlans(): void {
    this.sessionService.getPlans().pipe(
      take(1), tap((plans) => this.plans = plans),
      catchError(() => { showError(this.snackBar, 'Failed to load plans'); return of([] as PlanSummary[]); })
    ).subscribe(() => this.repopulateIfEditMode());
  }

  private setupFormSubscriptions(): void {
    this.addExerciseForm.get('exerciseId')?.valueChanges.subscribe((id) => this.updateAddFormWeightValidator(id));
    this.sessionForm.get('planId')?.valueChanges.subscribe((planId) => {
      if (!this.isInitializingPosition) this.prefillPosition(planId as string | null);
    });
  }

  private repopulateIfEditMode(): void {
    if (this.isEditMode() && this.dialogData?.session) this.populateFromSession(this.dialogData.session);
  }

  // Form Population
  private populateFromSession(session: SessionDetail): void {
    this.isInitializingPosition = true;
    this.sessionForm.patchValue({ name: session.name, planId: session.planId ?? '', orderID: session.orderID ?? null });
    this.isInitializingPosition = false;
    this.populateExercisesArray(session.exercises);
  }

  private populateExercisesArray(exercises: SessionExerciseDetail[]): void {
    this.exercisesArray.clear();
    (exercises || []).forEach((ex, idx) => {
      this.exercisesArray.push(buildExerciseFormGroup(this.fb, ex, idx, (id) => this.getExerciseCategory(id)));
    });
    updateExerciseOrderNumbers(this.exercisesArray);
  }

  // Helpers
  private buildPayload(): SessionCreatePayload | SessionUpdatePayload {
    const formValue = this.sessionForm.value;
    return {
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
  }

  private resetAddExerciseForm(): void {
    this.addExerciseForm.patchValue({ exerciseId: '', plannedSets: null, plannedReps: null, plannedWeight: null });
    this.showAddForm = false;
  }

  private prefillPosition(planId: string | null | undefined): void {
    const positionControl = this.sessionForm.get('orderID');
    if (!positionControl || !planId) { positionControl?.setValue(null); return; }

    this.sessionService.getNextAvailablePosition(planId, this.sessionId ?? undefined).pipe(take(1)).subscribe({
      next: (pos) => { if (this.sessionForm.get('planId')?.value === planId) positionControl.setValue(pos ?? null, { emitEvent: false }); },
      error: () => positionControl.setValue(null, { emitEvent: false })
    });
  }

  private updateAddFormWeightValidator(exerciseId: string | null): void {
    const weightControl = this.addExerciseForm.get('plannedWeight');
    if (!weightControl) return;
    const category = exerciseId ? this.getExerciseCategory(exerciseId) : '';
    weightControl.setValidators(getWeightValidators(category));
    weightControl.updateValueAndValidity({ emitEvent: false });
  }
}
