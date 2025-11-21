import { Injectable, signal, effect } from '@angular/core';

export type Theme = 'light' | 'dark';

@Injectable({
    providedIn: 'root'
})
export class ThemeService {
    private readonly THEME_STORAGE_KEY = 'fitness-tracker-theme';

    // Signal for reactive theme state
    readonly currentTheme = signal<Theme>('light');

    constructor() {
        this.loadTheme();

        // Apply theme whenever it changes
        effect(() => {
            this.applyTheme(this.currentTheme());
        });
    }

    /**
     * Toggle between light and dark themes
     */
    toggleTheme(): void {
        const newTheme: Theme = this.currentTheme() === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
    }

    /**
     * Set a specific theme
     */
    setTheme(theme: Theme): void {
        this.currentTheme.set(theme);
        this.saveTheme(theme);
    }

    /**
     * Load theme from localStorage or use default
     */
    private loadTheme(): void {
        try {
            const savedTheme = localStorage.getItem(this.THEME_STORAGE_KEY) as Theme | null;
            if (savedTheme === 'light' || savedTheme === 'dark') {
                this.currentTheme.set(savedTheme);
            }
        } catch (error) {
            console.warn('Failed to load theme from localStorage:', error);
        }
    }

    /**
     * Save theme to localStorage
     */
    private saveTheme(theme: Theme): void {
        try {
            localStorage.setItem(this.THEME_STORAGE_KEY, theme);
        } catch (error) {
            console.warn('Failed to save theme to localStorage:', error);
        }
    }

    /**
     * Apply theme to document
     */
    private applyTheme(theme: Theme): void {
        const htmlElement = document.documentElement;

        if (theme === 'dark') {
            htmlElement.setAttribute('data-theme', 'dark');
        } else {
            htmlElement.removeAttribute('data-theme');
        }
    }
}
