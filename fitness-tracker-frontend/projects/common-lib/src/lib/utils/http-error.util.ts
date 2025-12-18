import { throwError, Observable } from 'rxjs';
import { COMMON_ERROR_MESSAGES } from '../constants/http-error.constants';

export interface HttpErrorConfig {
    defaultMessage: string;
    notFoundMessage?: string;
    conflictMessage?: string;
    badRequestMessage?: string;
    connectionMessage?: string;
}

export function handleHttpError(err: any, config: HttpErrorConfig): Observable<never> {
    let errorMessage = config.defaultMessage;

    switch (err?.status) {
        case 404:
            errorMessage = config.notFoundMessage ?? errorMessage;
            break;
        case 409:
            errorMessage = extractErrorMessage(err) || config.conflictMessage || errorMessage;
            break;
        case 400:
            errorMessage = config.badRequestMessage ?? errorMessage;
            break;
        case 0:
            errorMessage = config.connectionMessage ?? COMMON_ERROR_MESSAGES.CONNECTION_ERROR;
            break;
        default:
            if (err?.message) {
                errorMessage = err.message;
            }
    }

    const error = Object.assign(new Error(errorMessage), {
        status: err?.status,
        error: err?.error
    });

    return throwError(() => error);
}

function extractErrorMessage(err: any): string | null {
    if (typeof err?.error === 'string' && err.error.trim()) {
        return err.error;
    }
    if (typeof err?.error?.message === 'string') {
        return err.error.message;
    }
    return null;
}
