import { ChangeDetectionStrategy, Component, ElementRef, inject, OnDestroy, OnInit, signal, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'home-home-hero-section',
  imports: [CommonModule],
  templateUrl: './home-hero-section.html',
  styleUrl: './home-hero-section.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeHeroSection implements OnInit, OnDestroy {
  private readonly elementRef = inject(ElementRef);

  // Signal to track scroll progress (0 to 1)
  readonly scrollProgress = signal(0);

  // Signal for the lift animation state
  readonly isLifted = signal(false);

  private scrollListener: (() => void) | null = null;

  ngOnInit(): void {
    this.setupScrollListener();
  }

  ngOnDestroy(): void {
    if (this.scrollListener) {
      window.removeEventListener('scroll', this.scrollListener);
    }
  }

  private setupScrollListener(): void {
    this.scrollListener = () => {
      requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        const windowHeight = window.innerHeight;

        // Calculate progress based on first viewport height
        // We want the animation to complete within the first 100vh of scroll
        const progress = Math.min(Math.max(scrollY / (windowHeight * 0.8), 0), 1);

        this.scrollProgress.set(progress);
        this.isLifted.set(progress > 0.1);
      });
    };

    window.addEventListener('scroll', this.scrollListener, { passive: true });
  }
}
