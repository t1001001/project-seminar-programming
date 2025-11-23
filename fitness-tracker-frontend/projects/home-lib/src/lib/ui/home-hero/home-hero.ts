import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  viewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import DrawSVGPlugin from 'gsap/DrawSVGPlugin';

@Component({
  selector: 'home-hero',
  imports: [CommonModule],
  templateUrl: './home-hero.html',
  styleUrl: './home-hero.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeHero implements AfterViewInit, OnDestroy {
  // Use viewChild signal for safer element access
  private readonly wrapper = viewChild.required<ElementRef<HTMLElement>>('wrapper');
  private readonly dialLogo = viewChild.required<ElementRef<SVGElement>>('dialLogo');
  private readonly slogan = viewChild.required<ElementRef<HTMLElement>>('slogan');
  private readonly dialContainer = viewChild.required<ElementRef<HTMLElement>>('dialContainer');

  // SVG path elements
  private readonly logoFill = viewChild.required<ElementRef<SVGPathElement>>('logoFill');
  private readonly clipPath = viewChild.required<ElementRef<SVGPathElement>>('clipPath');

  // Word elements
  private readonly wordTop = viewChild.required<ElementRef<HTMLElement>>('wordTop');
  private readonly wordRight = viewChild.required<ElementRef<HTMLElement>>('wordRight');
  private readonly wordBottom = viewChild.required<ElementRef<HTMLElement>>('wordBottom');
  private readonly wordLeft = viewChild.required<ElementRef<HTMLElement>>('wordLeft');

  constructor() {
    gsap.registerPlugin(ScrollTrigger, DrawSVGPlugin);
  }

  ngAfterViewInit(): void {
    const wrapperEl = this.wrapper().nativeElement;
    const logoEl = this.dialLogo().nativeElement;
    const sloganEl = this.slogan().nativeElement;
    const dialContainerEl = this.dialContainer().nativeElement;

    // SVG path elements
    const logoFillEl = this.logoFill().nativeElement;
    const clipPathEl = this.clipPath().nativeElement;

    const words = [
      this.wordTop().nativeElement,
      this.wordRight().nativeElement,
      this.wordBottom().nativeElement,
      this.wordLeft().nativeElement,
    ];

    // Hide buzzwords initially
    gsap.set(words, { opacity: 0 });

    // Initial state: Top word active (but hidden)
    words[0].classList.add('active');

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: wrapperEl,
        start: 'top 80px',
        end: '+=5000', // Increased scroll distance for sequence
        scrub: 0, // Instant response to scroll
        pin: true,
        anticipatePin: 1,
      },
    });

    // Step 1: Animate Slogan Out
    tl.to(sloganEl, {
      y: -100,
      autoAlpha: 0, // Combines opacity and visibility
      scale: 1.5,
      duration: 2,
      ease: 'none', // Linear easing for instant start
      immediateRender: false
    });

    // Step 2: Animate Dial Container In
    tl.to(dialContainerEl, {
      opacity: 1,
      scale: 1,
      duration: 2,
      ease: 'power2.out',
      immediateRender: false
    }, '-=1'); // Overlap slightly with slogan fade out

    // Step 3: Pie chart sweep from 0% to 75% using clip path
    tl.to({}, {
      duration: 2.5,
      ease: 'power2.inOut',
      onUpdate: function (this: gsap.core.Tween) {
        const progress = this.progress();
        const targetAngle = 270; // 75% of 360°
        const currentAngle = progress * targetAngle;

        const centerX = 30;
        const centerY = 30;
        const radius = 50; // Large enough to cover entire logo

        // Start from right (0°) and sweep COUNTER-CLOCKWISE to create 3/4 circle
        // 0° = right, -90° = up, -180° = left, -270° = down
        const startAngleDeg = 0;
        const endAngleDeg = -currentAngle; // Negative for counter-clockwise

        // Convert to radians
        const startAngleRad = (startAngleDeg * Math.PI) / 180;
        const endAngleRad = (endAngleDeg * Math.PI) / 180;

        // Calculate start and end points on the circle
        const startX = centerX + radius * Math.cos(startAngleRad);
        const startY = centerY + radius * Math.sin(startAngleRad);
        const endX = centerX + radius * Math.cos(endAngleRad);
        const endY = centerY + radius * Math.sin(endAngleRad);

        // Large arc flag: 1 if arc should be > 180°, 0 otherwise
        const largeArcFlag = currentAngle > 180 ? 1 : 0;

        // Sweep flag: 0 for counter-clockwise direction
        const sweepFlag = 0;

        // Create pie wedge path
        const pathData = `M ${centerX},${centerY} L ${startX},${startY} A ${radius},${radius} 0 ${largeArcFlag},${sweepFlag} ${endX},${endY} Z`;

        clipPathEl.setAttribute('d', pathData);
      }
    }, '-=1');

    // Step 5: Fade in buzzwords after logo is drawn
    tl.to(words, {
      opacity: 1,
      duration: 1,
      stagger: 0.1,
      ease: 'power2.out'
    }, '-=0.5');

    // Step 6: Rotate the logo 360 degrees COUNTER-CLOCKWISE (to match drawing direction)
    tl.to(logoEl, {
      rotation: '-=360',
      transformOrigin: 'center center',
      ease: 'none',
      duration: 10, // Longer duration relative to entrance
      onUpdate: function (this: gsap.core.Tween) {
        // Access the tween's progress directly (0 to 1)
        const rotationProgress = this.progress();

        // Determine which word should be active based on COUNTER-CLOCKWISE rotation progress
        // Counter-clockwise sequence: Top (0) → Left (3) → Bottom (2) → Right (1) → Top (0)
        // 0-0.125: Top/TRACK (0) - bottom-right position
        // 0.125-0.375: Left/ACHIEVE (3) - top-right position  
        // 0.375-0.625: Bottom/IMPROVE (2) - top-left position
        // 0.625-0.875: Right/ANALYZE (1) - bottom-left position
        // 0.875-1.0: Top/TRACK (0) - back to start

        let activeIndex = 0;
        if (rotationProgress > 0.125 && rotationProgress <= 0.375) {
          activeIndex = 3; // Left/ACHIEVE
        } else if (rotationProgress > 0.375 && rotationProgress <= 0.625) {
          activeIndex = 2; // Bottom/IMPROVE
        } else if (rotationProgress > 0.625 && rotationProgress <= 0.875) {
          activeIndex = 1; // Right/ANALYZE
        } else if (rotationProgress > 0.875) {
          activeIndex = 0; // Top/TRACK
        }

        // Update classes
        words.forEach((word, index) => {
          if (index === activeIndex) {
            word.classList.add('active');
          } else {
            word.classList.remove('active');
          }
        });
      }
    });
  }

  ngOnDestroy(): void {
    // Kill all ScrollTriggers created by this component to prevent memory leaks
    ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
  }
}
