import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Exercise } from 'exercises-lib';

interface ExerciseDetailInput {
    id?: string;
    exerciseId?: string;
    orderID?: number;
    plannedSets?: number;
    plannedReps?: number;
    plannedWeight?: number;
    category?: string;
    exerciseName?: string;
}

export function getWeightValidators(category: string) {
    const minWeight = category === 'BodyWeight' ? 0 : 1;
    return [Validators.required, Validators.min(minWeight)];
}

export function buildExerciseFormGroup(
    fb: FormBuilder,
    exercise: Partial<ExerciseDetailInput>,
    index: number,
    getCategory: (id: string) => string
): FormGroup {
    const exerciseId = exercise.exerciseId || (exercise as { id?: string }).id || '';
    const category = getCategory(exerciseId);
    const weightValidators = getWeightValidators(category);

    return fb.group({
        executionId: [(exercise as ExerciseDetailInput).id || null],
        exerciseId: [exercise.exerciseId, Validators.required],
        plannedSets: [exercise.plannedSets ?? 0, [Validators.required, Validators.min(1)]],
        plannedReps: [exercise.plannedReps ?? 0, [Validators.required, Validators.min(1)]],
        plannedWeight: [exercise.plannedWeight ?? null, weightValidators],
        orderID: [exercise.orderID ?? index + 1],
    });
}

export function updateExerciseOrderNumbers(exercisesArray: FormArray): void {
    exercisesArray.controls.forEach((ctrl, idx) => {
        ctrl.get('orderID')?.setValue(idx + 1);
    });
}

export function isExerciseDuplicate(exerciseId: string, exercisesArray: FormArray): boolean {
    return exercisesArray.controls.some(ctrl => ctrl.value.exerciseId === exerciseId);
}

export function getAvailableExercises(exercises: Exercise[], exercisesArray: FormArray): Exercise[] {
    const selectedIds = new Set(exercisesArray.controls.map(ctrl => ctrl.value.exerciseId));
    return exercises.filter(exercise => !selectedIds.has(exercise.id));
}

export interface ExerciseValidationResult {
    valid: boolean;
    errorMessage?: string;
}

export function validateExerciseInput(
    values: { plannedSets: number; plannedReps: number; plannedWeight: number; exerciseId: string },
    requiresPositiveWeight: boolean
): ExerciseValidationResult {
    if (values.plannedSets <= 0 || values.plannedReps <= 0) {
        return { valid: false, errorMessage: 'Sets and reps must be greater than 0' };
    }
    if (values.plannedWeight < 0) {
        return { valid: false, errorMessage: 'Weight cannot be negative' };
    }
    if (requiresPositiveWeight && values.plannedWeight <= 0) {
        return { valid: false, errorMessage: 'Weight must be greater than 0 for this exercise' };
    }
    return { valid: true };
}

export function validateUniqueExerciseIds(exercisesArray: FormArray): ExerciseValidationResult {
    const exerciseIds = new Set<string>();
    for (const ctrl of exercisesArray.controls) {
        const id = ctrl.value.exerciseId;
        if (exerciseIds.has(id)) {
            return { valid: false, errorMessage: 'Each exercise can only be added once per session' };
        }
        exerciseIds.add(id);
    }
    return { valid: true };
}
