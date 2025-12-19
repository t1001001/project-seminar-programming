import { throwError, Observable } from 'rxjs';
import { ERROR_MESSAGES, MAX_ORDER_VALUE } from './session.constants';
import { Exercise } from 'exercises-lib';

export interface SessionExerciseInput {
    id?: string;
    exerciseId: string;
    plannedSets: number;
    plannedReps: number;
    plannedWeight: number;
    orderID?: number;
    category?: Exercise['category'];
}

export interface SessionPayload {
    name?: string;
    planId?: string;
    orderID?: number | null;
    exercises?: SessionExerciseInput[];
}

export type ValidationResult = { valid: true } | { valid: false; error: Observable<never> };

export function validateSessionFields(payload: SessionPayload, operation: 'create' | 'update'): ValidationResult {
    const name = payload.name?.trim();
    if (!name) {
        return { valid: false, error: throwError(() => new Error(ERROR_MESSAGES.SESSION_NAME_REQUIRED)) };
    }
    if (operation === 'create') {
        if (!payload.planId) {
            const message = `${ERROR_MESSAGES.PLAN_REQUIRED} to ${operation} a session`;
            return { valid: false, error: throwError(() => new Error(message)) };
        }
        if (payload.orderID == null || payload.orderID < 1 || payload.orderID > MAX_ORDER_VALUE) {
            return { valid: false, error: throwError(() => new Error(`Order must be between 1 and ${MAX_ORDER_VALUE}`)) };
        }
    }
    if (operation === 'update' && payload.planId) {
        if (payload.orderID == null || payload.orderID < 1 || payload.orderID > MAX_ORDER_VALUE) {
            return { valid: false, error: throwError(() => new Error(`Order must be between 1 and ${MAX_ORDER_VALUE}`)) };
        }
    }
    return { valid: true };
}

export function validateExerciseInputs(exercises: SessionExerciseInput[] | undefined): ValidationResult {
    if (!exercises?.length) {
        return { valid: true };
    }

    const exerciseIds = new Set<string>();
    for (const exercise of exercises) {
        if (exerciseIds.has(exercise.exerciseId)) {
            return { valid: false, error: throwError(() => new Error(ERROR_MESSAGES.DUPLICATE_EXERCISE)) };
        }
        exerciseIds.add(exercise.exerciseId);

        if (!exercise.plannedSets || exercise.plannedSets <= 0) {
            return { valid: false, error: throwError(() => new Error(ERROR_MESSAGES.SETS_REQUIRED)) };
        }
        if (!exercise.plannedReps || exercise.plannedReps <= 0) {
            return { valid: false, error: throwError(() => new Error(ERROR_MESSAGES.REPS_REQUIRED)) };
        }
        if (exercise.plannedWeight == null || exercise.plannedWeight < 0) {
            return { valid: false, error: throwError(() => new Error(ERROR_MESSAGES.WEIGHT_INVALID)) };
        }
        if (exercise.category !== 'BodyWeight' && exercise.plannedWeight <= 0) {
            return { valid: false, error: throwError(() => new Error(ERROR_MESSAGES.WEIGHT_REQUIRED)) };
        }
    }

    return { valid: true };
}

export function validateSessionWithExercises(
    payload: SessionPayload,
    operation: 'create' | 'update'
): ValidationResult {
    const sessionResult = validateSessionFields(payload, operation);
    if (!sessionResult.valid) {
        return sessionResult;
    }
    return validateExerciseInputs(payload.exercises);
}
