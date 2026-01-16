import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { AuthService } from 'common-lib';

@Component({
    selector: 'app-login',
    imports: [
        ReactiveFormsModule,
        RouterLink,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
    ],
    templateUrl: './login.html',
    styleUrl: './login.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
    private readonly fb = inject(FormBuilder);
    private readonly router = inject(Router);
    private readonly authService = inject(AuthService);

    readonly form = this.fb.group({
        username: ['', [Validators.required]],
        password: ['', [Validators.required]],
    });

    readonly errorMessage = signal<string | null>(null);
    readonly isLoading = signal(false);
    readonly hidePassword = signal(true);

    onSubmit(): void {
        if (this.form.invalid) {
            return;
        }

        const { username, password } = this.form.value;
        this.errorMessage.set(null);
        this.isLoading.set(true);

        this.authService.login(username!, password!).subscribe({
            next: () => {
                this.isLoading.set(false);
                this.router.navigate(['/home']);
            },
            error: (err) => {
                this.isLoading.set(false);
                this.errorMessage.set(err.message);
            },
        });
    }

    togglePasswordVisibility(): void {
        this.hidePassword.update((hide) => !hide);
    }
}
