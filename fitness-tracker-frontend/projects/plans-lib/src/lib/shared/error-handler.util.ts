import { HttpErrorConfig, handleHttpError } from 'common-lib';
import { Observable } from 'rxjs';
import { ERROR_MESSAGES } from './plan.constants';

export type PlanErrorConfig = HttpErrorConfig;

export function handlePlanError(err: any, config: PlanErrorConfig): Observable<never> {
    return handleHttpError(err, config);
}

export function createPlanErrorConfig(operation: 'create' | 'load' | 'loadAll' | 'update' | 'delete'): PlanErrorConfig {
    const configs: Record<string, PlanErrorConfig> = {
        create: {
            defaultMessage: ERROR_MESSAGES.FAILED_CREATE,
            conflictMessage: ERROR_MESSAGES.PLAN_CONFLICT,
            badRequestMessage: ERROR_MESSAGES.INVALID_DATA,
        },
        load: {
            defaultMessage: ERROR_MESSAGES.FAILED_LOAD,
            notFoundMessage: ERROR_MESSAGES.PLAN_NOT_FOUND,
        },
        loadAll: {
            defaultMessage: ERROR_MESSAGES.FAILED_LOAD_ALL,
        },
        update: {
            defaultMessage: ERROR_MESSAGES.FAILED_UPDATE,
            notFoundMessage: ERROR_MESSAGES.PLAN_NOT_FOUND,
            conflictMessage: ERROR_MESSAGES.PLAN_CONFLICT,
            badRequestMessage: ERROR_MESSAGES.INVALID_DATA,
        },
        delete: {
            defaultMessage: ERROR_MESSAGES.FAILED_DELETE,
            notFoundMessage: ERROR_MESSAGES.PLAN_DELETED,
        },
    };

    return configs[operation];
}
