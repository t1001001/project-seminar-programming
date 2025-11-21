import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ThemeService } from '../../services/theme.service';

@Component({
    selector: 'app-theme-toggle',
    standalone: true,
    imports: [MatButtonModule, MatIconModule, MatTooltipModule],
    template: `
    <button 
      mat-icon-button 
      (click)="toggleTheme()"
      [matTooltip]="themeService.currentTheme() === 'light' ? 'Switch to dark mode' : 'Switch to light mode'"
      class="theme-toggle-btn"
    >
      <mat-icon>{{ themeService.currentTheme() === 'light' ? 'dark_mode' : 'light_mode' }}</mat-icon>
    </button>
  `,
    styles: [`
    .theme-toggle-btn {
      color: var(--fitness-text-primary);
      transition: transform 0.2s ease;
      
      &:hover {
        transform: scale(1.1);
      }
      
      mat-icon {
        transition: transform 0.3s ease;
      }
    }
  `]
})
export class ThemeToggleComponent {
    readonly themeService = inject(ThemeService);

    toggleTheme(): void {
        this.themeService.toggleTheme();
    }
}
