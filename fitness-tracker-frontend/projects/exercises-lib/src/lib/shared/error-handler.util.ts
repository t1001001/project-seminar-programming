import { HttpErrorConfig, handleHttpError } from 'common-lib';
import { Observable } from 'rxjs';
import { ERROR_MESSAGES } from './exercise.constants';

export type ExerciseErrorConfig = HttpErrorConfig;

export function handleExerciseError(err: any, config: ExerciseErrorConfig): Observable<never> {
    return handleHttpError(err, config);
}

export function createExerciseErrorConfig(operation: 'create' | 'load' | 'loadAll' | 'update' | 'delete'): ExerciseErrorConfig {
    const configs: Record<string, ExerciseErrorConfig> = {
        create: {
            defaultMessage: ERROR_MESSAGES.FAILED_CREATE,
            conflictMessage: ERROR_MESSAGES.EXERCISE_CONFLICT,
            badRequestMessage: ERROR_MESSAGES.INVALID_DATA,
        },
        load: {
            defaultMessage: ERROR_MESSAGES.FAILED_LOAD,
            notFoundMessage: ERROR_MESSAGES.EXERCISE_NOT_FOUND,
        },
        loadAll: {
            defaultMessage: ERROR_MESSAGES.FAILED_LOAD_ALL,
        },
        update: {
            defaultMessage: ERROR_MESSAGES.FAILED_UPDATE,
            notFoundMessage: ERROR_MESSAGES.EXERCISE_NOT_FOUND,
            conflictMessage: ERROR_MESSAGES.EXERCISE_CONFLICT,
            badRequestMessage: ERROR_MESSAGES.INVALID_DATA,
        },
        delete: {
            defaultMessage: ERROR_MESSAGES.FAILED_DELETE,
            notFoundMessage: ERROR_MESSAGES.EXERCISE_DELETED,
        },
    };

    return configs[operation];
}
