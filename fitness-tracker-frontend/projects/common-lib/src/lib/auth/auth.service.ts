import { Injectable, inject, signal, computed } from '@angular/core';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { UserProviderService } from './user-provider.service';
import { User } from './user.model';

const AUTH_STORAGE_KEY = 'fitness_auth_header';
const USER_STORAGE_KEY = 'fitness_user';

@Injectable({ providedIn: 'root' })
export class AuthService {
    private readonly userProvider = inject(UserProviderService);

    private readonly currentUserSignal = signal<User | null>(null);
    readonly currentUser = this.currentUserSignal.asReadonly();
    readonly isLoggedIn = computed(() => this.currentUserSignal() !== null);

    constructor() {
        this.restoreSession();
    }

    login(username: string, password: string): Observable<string> {
        const authHeader = 'Basic ' + btoa(username + ':' + password);

        return this.userProvider.validateLogin(authHeader).pipe(
            tap((returnedUsername) => {
                localStorage.setItem(AUTH_STORAGE_KEY, authHeader);
                localStorage.setItem(USER_STORAGE_KEY, returnedUsername);
                this.currentUserSignal.set({ username: returnedUsername });
            }),
            catchError((error) => {
                let errorMessage = 'Login failed. Please try again.';
                if (error.status === 401) {
                    errorMessage = 'Invalid username or password.';
                } else if (error.status === 0) {
                    errorMessage = 'Cannot connect to server. Please check your connection.';
                }
                return throwError(() => new Error(errorMessage));
            })
        );
    }

    logout(): void {
        localStorage.removeItem(AUTH_STORAGE_KEY);
        localStorage.removeItem(USER_STORAGE_KEY);
        this.currentUserSignal.set(null);
    }

    getAuthHeader(): string | null {
        return localStorage.getItem(AUTH_STORAGE_KEY);
    }

    private restoreSession(): void {
        const storedUser = localStorage.getItem(USER_STORAGE_KEY);
        const storedAuth = localStorage.getItem(AUTH_STORAGE_KEY);

        if (storedUser && storedAuth) {
            this.currentUserSignal.set({ username: storedUser });
        }
    }
}
