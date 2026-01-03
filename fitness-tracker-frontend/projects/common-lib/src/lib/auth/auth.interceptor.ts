import { HttpInterceptorFn } from '@angular/common/http';

const AUTH_STORAGE_KEY = 'fitness_auth_header';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
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
