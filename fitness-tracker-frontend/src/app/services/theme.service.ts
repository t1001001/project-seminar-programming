import { DOCUMENT } from '@angular/common';
import { effect, inject, Injectable, signal } from '@angular/core';

export type Theme = 'light' | 'dark';

@Injectable({ providedIn: 'root' })
export class ThemeService {
    private readonly document = inject(DOCUMENT);

    readonly currentTheme = signal<Theme>(
        (localStorage.getItem('fitness-tracker-theme') as Theme) || 'light'
    );

    constructor() {
        effect(() => {
            const theme = this.currentTheme();

            // Apply theme to DOM for CSS variable support
            if (theme === 'dark') {
                this.document.documentElement.setAttribute('data-theme', 'dark');
            } else {
                this.document.documentElement.removeAttribute('data-theme');
            }

            // Persist theme preference for page reloads
            localStorage.setItem('fitness-tracker-theme', theme);
        });
    }

    toggleTheme(): void {
        this.currentTheme.update(t => t === 'light' ? 'dark' : 'light');
    }
}
