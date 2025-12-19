import { HttpErrorConfig, handleHttpError } from 'common-lib';
import { Observable } from 'rxjs';
import { ERROR_MESSAGES } from './workout.constants';

export type WorkoutErrorConfig = HttpErrorConfig;

export function handleWorkoutError(err: any, config: WorkoutErrorConfig): Observable<never> {
    return handleHttpError(err, config);
}

export function createWorkoutErrorConfig(operation: 'create' | 'load' | 'loadAll' | 'update' | 'delete' | 'start' | 'save' | 'cancel'): WorkoutErrorConfig {
    const configs: Record<string, WorkoutErrorConfig> = {
        start: {
            defaultMessage: ERROR_MESSAGES.FAILED_START,
            notFoundMessage: ERROR_MESSAGES.SESSION_NOT_FOUND,
            badRequestMessage: ERROR_MESSAGES.NO_EXERCISES,
        },
        load: {
            defaultMessage: ERROR_MESSAGES.FAILED_LOAD,
            notFoundMessage: ERROR_MESSAGES.WORKOUT_NOT_FOUND,
        },
        save: {
            defaultMessage: ERROR_MESSAGES.FAILED_SAVE,
            notFoundMessage: ERROR_MESSAGES.WORKOUT_NOT_FOUND,
            badRequestMessage: ERROR_MESSAGES.INVALID_DATA,
        },
        cancel: {
            defaultMessage: ERROR_MESSAGES.FAILED_CANCEL,
            notFoundMessage: ERROR_MESSAGES.WORKOUT_NOT_FOUND,
        },
        delete: {
            defaultMessage: ERROR_MESSAGES.FAILED_DELETE,
            notFoundMessage: ERROR_MESSAGES.WORKOUT_DELETED,
        },
        loadAll: {
            defaultMessage: ERROR_MESSAGES.FAILED_LOAD_ALL,
        },
    };

    return configs[operation];
}
