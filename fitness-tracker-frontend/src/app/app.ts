import { Component, computed, inject } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ThemeToggleComponent } from './components/theme-toggle/theme-toggle.component';
import { ThemeService } from './services/theme.service';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    NgOptimizedImage,
    ThemeToggleComponent
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  // Initialize theme service
  private readonly themeService = inject(ThemeService);
  private readonly logoLight = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjgwIiBoZWlnaHQ9IjYwIiB2aWV3Qm94PSIwIDAgMjgwIDYwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgogIDwhLS0gTG9nbyBJY29uIC0tPgogIDxwYXRoIGQ9Ik0zMCAwQzEzLjQzMTUgMCAwIDEzLjQzMTUgMCAzMEMwIDQ2LjU2ODUgMTMuNDMxNSA2MCAzMCA2MFYzMEg2MEM2MCAxMy40MzE1IDQ2LjU2ODUgMCAzMCAwWiIgZmlsbD0iIzBERjI1OSIvPgogIAogIDwhLS0gRml0VHJhY2sgVGV4dCAtLT4KICA8dGV4dCB4PSI3NSIgeT0iNDIiIGZvbnQtZmFtaWx5PSJQb3BwaW5zLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjM2IiBmb250LXdlaWdodD0iNzAwIiBmaWxsPSIjMTExODEzIiBsZXR0ZXItc3BhY2luZz0iLTEiPkZpdFRyYWNrPC90ZXh0Pgo8L3N2Zz4K';
  private readonly logoDark = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjgwIiBoZWlnaHQ9IjYwIiB2aWV3Qm94PSIwIDAgMjgwIDYwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgogIDwhLS0gTG9nbyBJY29uIC0tPgogIDxwYXRoIGQ9Ik0zMCAwQzEzLjQzMTUgMCAwIDEzLjQzMTUgMCAzMEMwIDQ2LjU2ODUgMTMuNDMxNSA2MCAzMCA2MFYzMEg2MEM2MCAxMy40MzE1IDQ2LjU2ODUgMCAzMCAwWiIgZmlsbD0iIzBERjI1OSIvPgogIAogIDwhLS0gRml0VHJhY2sgVGV4dCAoRGFyayBNb2RlKSAtLT4KICA8dGV4dCB4PSI3NSIgeT0iNDIiIGZvbnQtZmFtaWx5PSJQb3BwaW5zLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjM2IiBmb250LXdlaWdodD0iNzAwIiBmaWxsPSIjRThFQUU5IiBsZXR0ZXItc3BhY2luZz0iLTEiPkZpdFRyYWNrPC90ZXh0Pgo8L3N2Zz4K';
  readonly logoSrc = computed(() =>
    this.themeService.currentTheme() === 'dark' ? this.logoDark : this.logoLight
  );

  menuOpen = false;

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  closeMenu() {
    this.menuOpen = false;
  }
}
