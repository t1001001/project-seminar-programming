import { HttpInterceptorFn } from '@angular/common/http';

const AUTH_STORAGE_KEY = 'fitness_auth_header';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    // Skip if the request already has an Authorization header (e.g., validateLogin)
    if (req.headers.has('Authorization')) {
        return next(req);
    }

    const authHeader = localStorage.getItem(AUTH_STORAGE_KEY);

    if (authHeader) {
        const clonedRequest = req.clone({
            setHeaders: {
                Authorization: authHeader,
            },
        });
        return next(clonedRequest);
    }

    return next(req);
};
