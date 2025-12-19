import { MatSnackBar } from '@angular/material/snack-bar';
import {
    SNACKBAR_SUCCESS_DURATION,
    SNACKBAR_ERROR_DURATION,
    SNACKBAR_ERROR_CLASS,
    SNACKBAR_SUCCESS_CLASS,
} from '../constants/snackbar.constants';

export function showError(snackBar: MatSnackBar, message: string): void {
    snackBar.open(message, 'Close', {
        duration: SNACKBAR_ERROR_DURATION,
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
        panelClass: [SNACKBAR_ERROR_CLASS],
    });
}

export function showSuccess(snackBar: MatSnackBar, message: string): void {
    snackBar.open(message, 'Close', {
        duration: SNACKBAR_SUCCESS_DURATION,
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
        panelClass: [SNACKBAR_SUCCESS_CLASS],
    });
}
