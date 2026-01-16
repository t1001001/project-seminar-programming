import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from './auth.service';
import { SNACKBAR_ERROR_CLASS, SNACKBAR_ERROR_DURATION } from '../constants/snackbar.constants';

export const authGuard: CanActivateFn = () => {
    const authService = inject(AuthService);
    const router = inject(Router);
    const snackBar = inject(MatSnackBar);

    if (authService.isLoggedIn()) {
        return true;
    }

    snackBar.open('You must be logged in to access this page', 'Login', {
        duration: SNACKBAR_ERROR_DURATION,
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
        panelClass: [SNACKBAR_ERROR_CLASS]
    }).onAction().subscribe(() => {
        router.navigate(['/login']);
    });

    return false;
};
