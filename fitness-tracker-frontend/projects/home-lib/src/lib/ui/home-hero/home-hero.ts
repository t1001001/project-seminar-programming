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
export class HomeHeroComponent implements AfterViewInit, OnDestroy {
  // Animation Constants
  private readonly SCROLL_START = 'top 80px';
  private readonly SCROLL_END = '+=5000';
  private readonly ANIMATION_DURATION_SLOGAN = 2;
  private readonly ANIMATION_DURATION_DIAL = 2;
  private readonly ANIMATION_DURATION_PIE = 2.5;
  private readonly ANIMATION_DURATION_WORDS = 1;
  private readonly ANIMATION_DURATION_ROTATION = 10;

  private readonly EIGHTH_TURN = 0.125;
  private readonly QUARTER_TURN = 0.25;

  // Geometry Constants
  private readonly PIE_CENTER_X = 30;
  private readonly PIE_CENTER_Y = 30;
  private readonly PIE_RADIUS = 50;
  private readonly PIE_TARGET_ANGLE = 270;

  // Use viewChild signal for safer element access
  private readonly wrapper = viewChild.required<ElementRef<HTMLElement>>('wrapper');
  private readonly dialLogo = viewChild.required<ElementRef<SVGElement>>('dialLogo');
  private readonly slogan = viewChild.required<ElementRef<HTMLElement>>('slogan');
  private readonly scrollIndicator = viewChild.required<ElementRef<HTMLElement>>('scrollIndicator');
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
    const elements = this.getElements();
    this.initializeState(elements.words);

    const tl = this.createTimeline(elements.wrapper);

    this.animateSlogan(tl, elements.slogan, elements.scrollIndicator);
    this.animateDialContainer(tl, elements.dialContainer);
    this.animatePieChart(tl, elements.clipPath);
    this.animateBuzzwords(tl, elements.words);
    this.animateLogoRotation(tl, elements.logo, elements.words);
  }

  ngOnDestroy(): void {
    ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
  }

  private getElements() {
    return {
      wrapper: this.wrapper().nativeElement,
      logo: this.dialLogo().nativeElement,
      slogan: this.slogan().nativeElement,
      scrollIndicator: this.scrollIndicator().nativeElement,
      dialContainer: this.dialContainer().nativeElement,
      clipPath: this.clipPath().nativeElement,
      words: [
        this.wordTop().nativeElement,
        this.wordRight().nativeElement,
        this.wordBottom().nativeElement,
        this.wordLeft().nativeElement,
      ]
    };
  }

  private initializeState(words: HTMLElement[]): void {
    gsap.set(words, { opacity: 0 });
    words[0].classList.add('active');
  }

  private createTimeline(trigger: HTMLElement): gsap.core.Timeline {
    return gsap.timeline({
      scrollTrigger: {
        trigger: trigger,
        start: this.SCROLL_START,
        end: this.SCROLL_END,
        scrub: 0,
        pin: true,
        anticipatePin: 1,
      },
    });
  }

  private animateSlogan(tl: gsap.core.Timeline, slogan: HTMLElement, scrollIndicator: HTMLElement): void {
    tl.to(slogan, {
      y: -100,
      autoAlpha: 0,
      scale: 1.5,
      duration: this.ANIMATION_DURATION_SLOGAN,
      ease: 'none',
      immediateRender: false
    })
      .to(scrollIndicator, {
        y: -50,
        autoAlpha: 0,
        duration: this.ANIMATION_DURATION_SLOGAN / 2, // Fade out faster
        ease: 'power1.out'
      }, '<'); // Start at the same time as slogan animation
  }

  private animateDialContainer(tl: gsap.core.Timeline, container: HTMLElement): void {
    tl.to(container, {
      opacity: 1,
      scale: 1,
      duration: this.ANIMATION_DURATION_DIAL,
      ease: 'power2.out',
      immediateRender: false
    }, '-=1');
  }

  private animatePieChart(tl: gsap.core.Timeline, clipPath: SVGPathElement): void {
    const proxy = { progress: 0 };
    tl.to(proxy, {
      progress: 1,
      duration: this.ANIMATION_DURATION_PIE,
      ease: 'power2.inOut',
      onUpdate: () => {
        const pathData = this.calculatePiePath(proxy.progress);
        clipPath.setAttribute('d', pathData);
      }
    }, '-=1');
  }

  private calculatePiePath(progress: number): string {
    const currentAngle = progress * this.PIE_TARGET_ANGLE;
    const startAngleDeg = 0;
    const endAngleDeg = -currentAngle;

    const startAngleRad = (startAngleDeg * Math.PI) / 180;
    const endAngleRad = (endAngleDeg * Math.PI) / 180;

    const startX = this.PIE_CENTER_X + this.PIE_RADIUS * Math.cos(startAngleRad);
    const startY = this.PIE_CENTER_Y + this.PIE_RADIUS * Math.sin(startAngleRad);
    const endX = this.PIE_CENTER_X + this.PIE_RADIUS * Math.cos(endAngleRad);
    const endY = this.PIE_CENTER_Y + this.PIE_RADIUS * Math.sin(endAngleRad);

    const largeArcFlag = currentAngle > 180 ? 1 : 0;
    const sweepFlag = 0;

    return `M ${this.PIE_CENTER_X},${this.PIE_CENTER_Y} L ${startX},${startY} A ${this.PIE_RADIUS},${this.PIE_RADIUS} 0 ${largeArcFlag},${sweepFlag} ${endX},${endY} Z`;
  }

  private animateBuzzwords(tl: gsap.core.Timeline, words: HTMLElement[]): void {
    tl.to(words, {
      opacity: 1,
      duration: this.ANIMATION_DURATION_WORDS,
      stagger: 0.1,
      ease: 'power2.out'
    }, '-=0.5');
  }

  private animateLogoRotation(tl: gsap.core.Timeline, logo: SVGElement, words: HTMLElement[]): void {
    const proxy = { progress: 0 };

    tl.to(proxy, {
      progress: 1,
      duration: this.ANIMATION_DURATION_ROTATION,
      ease: 'none',
      onUpdate: () => {
        const rotation = proxy.progress * -360;
        gsap.set(logo, { rotation: rotation, transformOrigin: 'center center' });

        this.updateActiveWord(proxy.progress, words);
      }
    });
  }

  private updateActiveWord(progress: number, words: HTMLElement[]): void {
    let activeIndex = 0;
    if (progress > this.EIGHTH_TURN && progress <= (this.EIGHTH_TURN + this.QUARTER_TURN)) {
      activeIndex = 3;
    } else if (progress > (this.EIGHTH_TURN + this.QUARTER_TURN) && progress <= (this.EIGHTH_TURN + 2 * this.QUARTER_TURN)) {
      activeIndex = 2;
    } else if (progress > (this.EIGHTH_TURN + 2 * this.QUARTER_TURN) && progress <= (this.EIGHTH_TURN + 3 * this.QUARTER_TURN)) {
      activeIndex = 1;
    } else if (progress > (this.EIGHTH_TURN + 3 * this.QUARTER_TURN)) {
      activeIndex = 0;
    }

    words.forEach((word, index) => {
      if (index === activeIndex) {
        word.classList.add('active');
      } else {
        word.classList.remove('active');
      }
    });
  }
}
