import { HttpErrorConfig, handleHttpError } from 'common-lib';
import { Observable } from 'rxjs';
import { ERROR_MESSAGES } from './session.constants';

export type SessionErrorConfig = HttpErrorConfig;

export function handleSessionError(err: any, config: SessionErrorConfig): Observable<never> {
    return handleHttpError(err, config);
}

export function createSessionErrorConfig(operation: 'create' | 'load' | 'loadAll' | 'update' | 'delete'): SessionErrorConfig {
    return {
        defaultMessage: `Failed to ${operation} session`,
        notFoundMessage: ERROR_MESSAGES.SESSION_NOT_FOUND,
        conflictMessage: ERROR_MESSAGES.DUPLICATE_SESSION,
        badRequestMessage: ERROR_MESSAGES.INVALID_SESSION_DATA,
    };
}
